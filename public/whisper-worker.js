/**
 * Whisper WebAssembly Worker
 * Handles offline speech transcription using Whisper.cpp compiled to WASM
 */

let whisperModule = null;
let isInitialized = false;

// Whisper model configurations
const MODEL_CONFIGS = {
  tiny: {
    url: '/models/ggml-tiny.en.bin',
    size: '39 MB',
    memory: 100 * 1024 * 1024, // 100MB
  },
  base: {
    url: '/models/ggml-base.en.bin',
    size: '142 MB',
    memory: 200 * 1024 * 1024, // 200MB
  },
  small: {
    url: '/models/ggml-small.en.bin',
    size: '466 MB',
    memory: 500 * 1024 * 1024, // 500MB
  },
  medium: {
    url: '/models/ggml-medium.en.bin',
    size: '1.5 GB',
    memory: 1000 * 1024 * 1024, // 1GB
  },
};

// Initialize Whisper WebAssembly module
async function initializeWhisper(config) {
  try {
    // Load the Whisper WASM module
    const Module = await import('/whisper.js');
    
    // Initialize with memory requirements
    whisperModule = new Module.default({
      locateFile: (path) => {
        if (path.endsWith('.wasm')) {
          return '/whisper.wasm';
        }
        return path;
      },
      onRuntimeInitialized: () => {
        console.log('Whisper WASM runtime initialized');
      },
    });

    // Load the specified model
    const modelConfig = MODEL_CONFIGS[config.model] || MODEL_CONFIGS.base;
    
    console.log(`Loading Whisper model: ${config.model} (${modelConfig.size})`);
    
    // Download and load model
    const modelResponse = await fetch(modelConfig.url);
    const modelArrayBuffer = await modelResponse.arrayBuffer();
    const modelData = new Uint8Array(modelArrayBuffer);
    
    // Initialize the model
    whisperModule.loadModel(modelData);
    
    isInitialized = true;
    console.log(`Whisper model ${config.model} loaded successfully`);
    
    return true;
  } catch (error) {
    console.error('Failed to initialize Whisper:', error);
    return false;
  }
}

// Transcribe audio using Whisper
async function transcribeAudio(audioData, config) {
  try {
    if (!isInitialized || !whisperModule) {
      throw new Error('Whisper not initialized');
    }

    // Convert audio data to the format expected by Whisper
    const audioArray = new Float32Array(audioData);
    
    // Set transcription parameters
    const params = {
      language: config.language || 'en',
      temperature: config.temperature || 0.0,
      max_tokens: config.maxTokens || 448,
      n_threads: navigator.hardwareConcurrency || 4,
    };

    // Perform transcription
    const result = whisperModule.transcribe(audioArray, params);
    
    // Parse the result
    const transcription = {
      text: result.text || '',
      confidence: result.confidence || 0.9,
      language: result.language || config.language,
      segments: result.segments || [],
    };

    return transcription;
  } catch (error) {
    console.error('Transcription failed:', error);
    throw error;
  }
}

// Handle messages from main thread
self.onmessage = async function(event) {
  const { type, data } = event.data;

  try {
    switch (type) {
      case 'init':
        const initialized = await initializeWhisper(data.config);
        self.postMessage({
          type: initialized ? 'initialized' : 'error',
          data: initialized ? { model: data.config.model } : { message: 'Failed to initialize Whisper' }
        });
        break;

      case 'transcribe':
        const result = await transcribeAudio(data.audioData, data.config);
        self.postMessage({
          type: 'transcription',
          data: result
        });
        break;

      default:
        self.postMessage({
          type: 'error',
          data: { message: `Unknown message type: ${type}` }
        });
    }
  } catch (error) {
    self.postMessage({
      type: 'error',
      data: { message: error.message }
    });
  }
};

// Handle errors
self.onerror = function(error) {
  console.error('Whisper worker error:', error);
  self.postMessage({
    type: 'error',
    data: { message: error.message || 'Worker error' }
  });
};
