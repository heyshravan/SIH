/**
 * SatQuery AI API Client Service
 * Connects frontend to the real FastAPI Agent Controller backend
 */

const getApiBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl) {
    return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  }
  return 'https://breeding-maria-price-corrected.trycloudflare.com';
};

export const API_BASE_URL = getApiBaseUrl();

/**
 * Parse GeoChat token coordinate strings like {<68><69><76><77>|<90>} or {<40><55><52><59>} if returned by the backend.
 * Dynamically derives label text (Water, Vessel, Building, etc.) based on the user's prompt keywords.
 */
export function parseGeoChatBoxes(text, prompt = '') {
  if (!text || typeof text !== 'string') return { cleanText: '', parsedBoxes: [] };

  let dynamicLabel = 'Target';
  const lowerPrompt = (prompt || '').toLowerCase();
  if (lowerPrompt.includes('water') || lowerPrompt.includes('ocean') || lowerPrompt.includes('river') || lowerPrompt.includes('lake') || lowerPrompt.includes('sea')) {
    dynamicLabel = 'Water';
  } else if (lowerPrompt.includes('ship') || lowerPrompt.includes('vessel') || lowerPrompt.includes('boat') || lowerPrompt.includes('harbor') || lowerPrompt.includes('port')) {
    dynamicLabel = 'Vessel';
  } else if (lowerPrompt.includes('building') || lowerPrompt.includes('house') || lowerPrompt.includes('structure') || lowerPrompt.includes('urban')) {
    dynamicLabel = 'Building';
  } else if (lowerPrompt.includes('vegetation') || lowerPrompt.includes('tree') || lowerPrompt.includes('forest') || lowerPrompt.includes('crop')) {
    dynamicLabel = 'Vegetation';
  }

  const parsedBoxes = [];
  // Flexible token regex matching {<y1><x1><y2><x2>|<conf>} or {<y1><x1><y2><x2>}
  const tokenRegex = /\{<(\d+)><(\d+)><(\d+)><(\d+)>(?:[|:]?<(\d+)>)?\}/g;

  let match;
  while ((match = tokenRegex.exec(text)) !== null) {
    const y1Token = parseInt(match[1], 10);
    const x1Token = parseInt(match[2], 10);
    const y2Token = parseInt(match[3], 10);
    const x2Token = parseInt(match[4], 10);
    const confToken = match[5] ? parseInt(match[5], 10) : null;

    const scale = y1Token > 100 || x1Token > 100 || y2Token > 100 || x2Token > 100 ? 10 : 1;

    const y1 = y1Token / scale;
    const x1 = x1Token / scale;
    const y2 = y2Token / scale;
    const x2 = x2Token / scale;

    parsedBoxes.push({
      x1,
      y1,
      x2,
      y2,
      x: x1,
      y: y1,
      width: Math.max(2, x2 - x1),
      height: Math.max(2, y2 - y1),
      label: dynamicLabel,
      confidence: confToken,
    });
  }

  // Strip all token coordinate strings cleanly
  let cleanText = text
    .replace(/\{<[^}]+\}/g, '')
    .replace(/\{<[\d\s><|:]+>\}/g, '')
    .trim();

  return { cleanText, parsedBoxes };
}

/**
 * Strip HTML tags (<p>, <div>, etc.) and raw GeoChat coordinate tokens completely
 */
export function cleanHtmlResponse(text) {
  if (!text || typeof text !== 'string') return '';

  // 1. Remove raw GeoChat coordinate token strings like {<68><69><76><77>|<90>} or {<0><48><62><92>}
  let clean = text
    .replace(/\{<[^}]+\}/g, '')
    .replace(/\{<[\d\s><|:]+>\}/g, '')
    .replace(/\{<[^>]*>\}/g, '')
    .trim();

  // 2. Strip standard HTML tags (<p>, <div>, <span>, <br>, etc.)
  clean = clean.replace(/<\/?(p|div|span|br|b|i|strong|em|h[1-6]|ul|ol|li|a)[^>]*>/gi, '').trim();

  // 3. Remove raw leftover brackets or empty token remnants
  if (
    clean === '{}' ||
    clean === '{|}' ||
    clean === '{}|{}' ||
    clean === '{ }' ||
    clean.startsWith('{<')
  ) {
    clean = '';
  }

  clean = clean
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');

  return clean;
}

/**
 * Health Check API
 * GET /api/v1/health
 */
export async function fetchHealthStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return { status: 'offline', healthy: false, error: `HTTP ${response.status}` };
    }

    const data = await response.json();
    return {
      status: data.status || 'online',
      healthy: true,
      data,
    };
  } catch (error) {
    return {
      status: 'offline',
      healthy: false,
      error: 'Backend currently unreachable',
    };
  }
}

/**
 * Helper to generate a valid 224x224 3-channel RGB PNG File object.
 * Used when a text-only query is sent to satisfy FastAPI's required `image: UploadFile = File(...)` field
 * while ensuring GeoChat's Vision Transformer (CLIP) mean/std normalization succeeds.
 */
function createFallbackRGBImageFile() {
  if (typeof document !== 'undefined') {
    const canvas = document.createElement('canvas');
    canvas.width = 224;
    canvas.height = 224;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, 224, 224);
      grad.addColorStop(0, '#1e1b4b');
      grad.addColorStop(1, '#065f46');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 224, 224);
    }
    const dataUrl = canvas.toDataURL('image/png');
    const byteString = atob(dataUrl.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: 'image/png' });
    return new File([blob], 'satellite_patch.png', { type: 'image/png' });
  }
  return null;
}

/**
 * Main Agent Query API (VQA & Change Detection Queries)
 * POST /api/v1/agent/query
 * Supports dual image attachments for Bi-Temporal Change Detection (T1 vs T2)
 */
export async function analyzeImage({
  image,
  image2 = null,
  prompt,
  taskType = 'auto',
  mode = 'expert',
  agentThink = true,
  earthSearch = false,
  signal = null,
}) {
  try {
    const formData = new FormData();

    let fileToUpload = null;
    if (image && image instanceof File) {
      fileToUpload = image;
    } else {
      fileToUpload = createFallbackRGBImageFile();
    }

    if (fileToUpload) {
      formData.append('image', fileToUpload);
    }

    if (image2 && image2 instanceof File) {
      formData.append('image2', image2);
    }

    const textPrompt = prompt || 'Analyze this satellite imagery.';
    formData.append('prompt', textPrompt);
    formData.append('taskType', taskType || 'auto');
    formData.append('mode', mode || 'expert');

    formData.append('agentThink', agentThink ? 'true' : 'false');
    formData.append('earthSearch', earthSearch ? 'true' : 'false');
    formData.append('reasoning', agentThink ? 'enabled' : 'disabled');

    const response = await fetch(`${API_BASE_URL}/api/v1/agent/query`, {
      method: 'POST',
      body: formData,
      signal,
    });

    if (!response.ok) {
      let errorDetail = `Server returned status code ${response.status}.`;
      try {
        const errData = await response.json();
        if (errData && errData.detail) {
          if (typeof errData.detail === 'string') {
            errorDetail = errData.detail;
          } else if (Array.isArray(errData.detail)) {
            errorDetail = errData.detail
              .map((d) => `${d.loc ? d.loc.join('.') : ''}: ${d.msg}`)
              .join(' | ');
          }
        } else if (errData && errData.message) {
          errorDetail = errData.message;
        }
      } catch (e) {
        // Non-JSON response
      }

      if (response.status === 413) {
        throw new Error('Satellite image file size is too large.');
      } else if (response.status === 500) {
        throw new Error(cleanHtmlResponse(errorDetail) || 'SatQuery AI backend processing error. Please try again.');
      } else {
        throw new Error(cleanHtmlResponse(errorDetail));
      }
    }

    const data = await response.json();

    if (data && data.answer) {
      data.answer = cleanHtmlResponse(data.answer);
    }
    if (data && data.response) {
      data.response = cleanHtmlResponse(data.response);
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    if (error.name === 'AbortError') {
      return {
        success: false,
        aborted: true,
        error: 'Query processing stopped by user.',
      };
    }
    console.error('SatQuery API Query Error:', error);
    return {
      success: false,
      error: cleanHtmlResponse(error.message) || 'SatQuery AI backend is currently unavailable. Please try again.',
    };
  }
}

/**
 * Real GeoChat Grounding API
 * POST /api/v1/models/geochat/grounding
 */
export async function analyzeGroundingImage({
  image,
  prompt,
  agentThink = true,
  earthSearch = false,
  signal = null,
}) {
  try {
    const formData = new FormData();

    let fileToUpload = null;
    if (image && image instanceof File) {
      fileToUpload = image;
    } else {
      fileToUpload = createFallbackRGBImageFile();
    }

    if (fileToUpload) {
      formData.append('image', fileToUpload);
    }

    formData.append('prompt', prompt || 'Locate target objects in this satellite image.');
    formData.append('agentThink', agentThink ? 'true' : 'false');
    formData.append('earthSearch', earthSearch ? 'true' : 'false');

    const response = await fetch(`${API_BASE_URL}/api/v1/models/geochat/grounding`, {
      method: 'POST',
      body: formData,
      signal,
    });

    if (!response.ok) {
      let errorDetail = `Server returned status code ${response.status}.`;
      try {
        const errData = await response.json();
        if (errData && errData.detail) {
          if (typeof errData.detail === 'string') {
            errorDetail = errData.detail;
          } else if (Array.isArray(errData.detail)) {
            errorDetail = errData.detail
              .map((d) => `${d.loc ? d.loc.join('.') : ''}: ${d.msg}`)
              .join(' | ');
          }
        } else if (errData && errData.message) {
          errorDetail = errData.message;
        }
      } catch (e) {
        // Non-JSON response
      }
      throw new Error(cleanHtmlResponse(errorDetail));
    }

    const data = await response.json();

    if (data && data.answer) {
      data.answer = cleanHtmlResponse(data.answer);
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    if (error.name === 'AbortError') {
      return {
        success: false,
        aborted: true,
        error: 'Grounding query processing stopped by user.',
      };
    }
    console.error('SatQuery Grounding API Error:', error);
    return {
      success: false,
      error: cleanHtmlResponse(error.message) || 'SatQuery AI grounding service unavailable.',
    };
  }
}
