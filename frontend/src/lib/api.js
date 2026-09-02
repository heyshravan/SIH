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
 * Parse GeoChat token coordinate strings like {<40><55><52><59>|<90>} if returned by the backend.
 * NO fallback/predefined boxes are created — only strict API responses are used.
 */
export function parseGeoChatBoxes(text) {
  if (!text || typeof text !== 'string') return { cleanText: '', parsedBoxes: [] };

  const parsedBoxes = [];
  const tokenRegex = /\{<(\d+)><(\d+)><(\d+)><(\d+)>(?:\|<(\d+)>)?\}/g;

  let match;
  let cleanText = text;

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
      width: Math.max(1, x2 - x1),
      height: Math.max(1, y2 - y1),
      label: 'Target',
      confidence: confToken,
    });
  }

  cleanText = cleanText.replace(tokenRegex, '').trim();

  return { cleanText, parsedBoxes };
}

/**
 * Strip HTML tags (<p>, <div>, etc.) and raw GeoChat coordinate tokens
 */
export function cleanHtmlResponse(text) {
  if (!text || typeof text !== 'string') return '';

  // 1. Remove raw GeoChat coordinate token strings like {<0><48><62><92>|<90>}
  let clean = text.replace(/\{<[^>]*>\}/g, '').trim();

  // 2. Strip standard HTML tags (<p>, <div>, <span>, <br>, etc.)
  clean = clean.replace(/<\/?(p|div|span|br|b|i|strong|em|h[1-6]|ul|ol|li|a)[^>]*>/gi, '').trim();

  // 3. Remove raw leftover brackets
  if (clean === '{}' || clean === '{|}' || clean === '{}|{}' || clean === '{ }') {
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
 * Main Agent Query API (VQA & General Queries)
 * POST /api/v1/agent/query
 * Passes agentThink and earthSearch parameters to FastAPI backend
 */
export async function analyzeImage({
  image,
  prompt,
  taskType = 'auto',
  mode = 'expert',
  agentThink = true,
  earthSearch = false,
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
 * Ensures a valid File is attached (user file or fallback image) to avoid body.image required error
 */
export async function analyzeGroundingImage({
  image,
  prompt,
  agentThink = true,
  earthSearch = false,
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
    console.error('SatQuery Grounding API Error:', error);
    return {
      success: false,
      error: cleanHtmlResponse(error.message) || 'SatQuery AI grounding service unavailable.',
    };
  }
}
