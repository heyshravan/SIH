/**
 * SatQuery AI API Client Service
 * Connects frontend to the real FastAPI Agent Controller backend
 */

const getApiBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl) {
    // Strip trailing slash if present
    return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  }
  return 'https://breeding-maria-price-corrected.trycloudflare.com';
};

export const API_BASE_URL = getApiBaseUrl();

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
 * Main Agent Query API
 * POST /api/v1/agent/query
 *
 * Sends multipart/form-data with image, prompt, taskType, and mode.
 * Note: Do NOT manually set Content-Type header so browser sets multipart boundary automatically.
 */
export async function analyzeImage({ image, prompt, taskType = 'auto', mode = 'expert' }) {
  try {
    const formData = new FormData();

    if (image) {
      formData.append('image', image);
    }

    formData.append('prompt', prompt || 'Analyze this satellite imagery.');
    formData.append('taskType', taskType || 'auto');
    formData.append('mode', mode || 'expert');

    const response = await fetch(`${API_BASE_URL}/api/v1/agent/query`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 413) {
        throw new Error('Satellite image file size is too large.');
      } else if (response.status === 500) {
        throw new Error('SatQuery AI backend processing error. Please try again.');
      } else {
        throw new Error(`Server returned status code ${response.status}.`);
      }
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('SatQuery API Query Error:', error);
    return {
      success: false,
      error: error.message || 'SatQuery AI backend is currently unavailable. Please try again.',
    };
  }
}
