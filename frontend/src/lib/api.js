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
 * Strip HTML tags (<p>, <div>, etc.) and decode HTML entities from text
 */
export function cleanHtmlResponse(text) {
  if (!text || typeof text !== 'string') return '';
  let clean = text.replace(/<[^>]*>?/gm, '').trim();
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
 * Main Agent Query API
 * POST /api/v1/agent/query
 *
 * Sends multipart/form-data with image, prompt, taskType, and mode.
 * Note: Do NOT manually set Content-Type header so browser sets multipart boundary automatically.
 */
export async function analyzeImage({ image, prompt, taskType = 'auto', mode = 'expert' }) {
  try {
    const formData = new FormData();

    // 1. Image file handling: use user-uploaded File or generate valid 224x224 RGB PNG for FastAPI UploadFile requirement
    let fileToUpload = null;
    if (image && image instanceof File) {
      fileToUpload = image;
    } else {
      fileToUpload = createFallbackRGBImageFile();
    }

    if (fileToUpload) {
      formData.append('image', fileToUpload);
    }

    // 2. Prompt text handling
    const textPrompt = prompt || 'Analyze this satellite imagery.';
    formData.append('prompt', textPrompt);

    // 3. Task type & Mode parameters
    formData.append('taskType', taskType || 'auto');
    formData.append('mode', mode || 'expert');

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

    // Clean HTML tags from backend answer
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
