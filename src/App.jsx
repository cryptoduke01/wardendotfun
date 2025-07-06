import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';

// Comprehensive vulgar words filter
const vulgarWords = [
  // English
  'fuck', 'penis', 'shit', 'bitch', 'ass', 'asshole', 'bastard', 'slut', 'whore', 'dick', 'cock', 'pussy',
  'faggot', 'nigger', 'cunt', 'tits', 'boobs', 'bollocks', 'jackass', 'motherfucker', 'jerkoff', 'dildo',
  'spank', 'orgy', 'suck', 'penis', 'vagina', 'anal', 'rape', 'molest', 'bang', 'deepthroat', 'fap',
  'cum', 'jizz', 'nut', 'blowjob', 'handjob', 'porn', 'pornhub', 'nude', 'naked', 'xxx', 'sex',
  'milf', 'bdsm', 'kinky', 'fetish', 'gag', 'grope', 'wet', 'horny', 'screw', 'hump', 'snatch',

  // Spanish
  'puta', 'mierda', 'coño', 'cabron', 'pendejo', 'gilipollas', 'hijo de puta', 'joder', 'estupido', 'idiota',
  'verga', 'chingar', 'culero', 'marica', 'zorra', 'perra', 'puto',

  // French
  'putain', 'merde', 'salope', 'connard', 'enculé', 'bite', 'chatte', 'cul', 'bordel', 'con', 'ta gueule',
  'nique', 'branleur', 'pd',

  // German
  'scheiße', 'fick', 'hure', 'arschloch', 'verdammt', 'fotze', 'wichser', 'schlampe', 'schwanz', 'hurensohn',

  // Russian (transliterated)
  'blyad', 'suka', 'pizda', 'hui', 'yob', 'yebat', 'govno', 'mudak', 'jebat', 'durak', 'eblan',

  // Hindi (transliterated)
  'madarchod', 'behenchod', 'chutiya', 'randi', 'saala', 'kameena', 'bhosdike', 'gaand', 'lund', 'choot',

  // Chinese (transliterated)
  'cao', 'ta ma de', 'ni ma', 'sha bi', 'gun dan', 'jian huo', 'sb', 'jb', 'lao niang', 'da bian',

  // Arabic (transliterated)
  'sharmouta', 'ibn kalb', 'kess emmak', 'khara', 'ayre', 'shlonak', 'zib', 'bint kalb', 'ya manyak', 'tizak',

  // Add obfuscated and leetspeak variants
  'f@ck', 'sh1t', 'b!tch', 'a$$', 'c0ck', 'p0rn', 'n@ked', 'xXx', 's3x', 'bl0wj0b', 'cumshot'
];

// Count API URL
const COUNT_API_URL = 'https://api.countapi.xyz/hit/wardenprotocol.com/visits';

function App() {
  const [inputText, setInputText] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageCount, setImageCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    document.title = "Warden Protocol - Your Crypto Co-Pilot";

    fetch(COUNT_API_URL)
      .then(response => response.json())
      .then(data => {
        if (data && data.value) {
          setImageCount(data.value);
        }
      })
      .catch(error => {
        console.error('Error fetching count:', error);
      });

    generateDefaultImage();
  }, []);

  const incrementImageCount = () => {
    fetch(COUNT_API_URL)
      .then(response => response.json())
      .then(data => {
        if (data && data.value) {
          setImageCount(data.value);
        }
      })
      .catch(error => {
        console.error('Error incrementing count:', error);
        const newCount = imageCount + 1;
        setImageCount(newCount);
      });
  };

  const checkVulgarWords = (text) => {
    const lowerText = text.toLowerCase();
    return vulgarWords.some(word => lowerText.includes(word));
  };

  const generateDefaultImage = async () => {
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      const width = 1200;
      const height = 960; // Reduced height for better aspect ratio
      canvas.width = width;
      canvas.height = height;

      // Warden Protocol gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#140901');
      gradient.addColorStop(1, '#CAFF94');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Subtle grid background
      createBackgroundGrid(ctx, width, height);

      // Set font to Syne
      const fontSize = 110;
      ctx.font = `bold ${fontSize}px Syne, sans-serif`;
      ctx.textAlign = 'center';

      // Add "Warden" text
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('Warden', width / 2, height / 3);

      // Add "is for" text
      ctx.fillText('is for', width / 2, height / 2);

      // Add default text in neon green
      const defaultText = "everyone";
      ctx.fillStyle = '#CAFF94';
      ctx.fillText(`[${defaultText}]`, width / 2, height / 2 + 140);

      // Add subtle Warden watermark
      ctx.font = '24px Syne, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillText('Made with ❤️ by duke.sol', width / 2, height - 40);

      const imageUrl = canvas.toDataURL('image/jpg');
      setGeneratedImage({
        url: imageUrl,
        text: defaultText
      });
    } catch (error) {
      console.error('Error generating default image:', error);
    }
  };

  const createBackgroundGrid = (ctx, width, height) => {
    ctx.strokeStyle = 'rgba(202, 255, 148, 0.1)';
    ctx.lineWidth = 1;

    // Horizontal lines
    for (let y = 0; y < height; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Vertical lines
    for (let x = 0; x < width; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
  };

  const generateImage = async () => {
    if (!inputText.trim()) return;

    // Check for vulgar words
    if (checkVulgarWords(inputText)) {
      setShowModal(true);
      return;
    }

    setIsLoading(true);
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      const width = 1200;
      const height = 960;
      canvas.width = width;
      canvas.height = height;

      // Warden Protocol gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#140901');
      gradient.addColorStop(1, '#CAFF94');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Subtle grid background
      createBackgroundGrid(ctx, width, height);

      // Set font to Syne
      const fontSize = 110;
      ctx.font = `bold ${fontSize}px Syne, sans-serif`;
      ctx.textAlign = 'center';

      // Add "Warden" text
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('Warden', width / 2, height / 3);

      // Add "is for" text
      ctx.fillText('is for', width / 2, height / 2);

      // Add input text in neon green with brackets
      ctx.fillStyle = '#CAFF94';
      ctx.fillText(`[${inputText}]`, width / 2, height / 2 + 140);

      // Add subtle Warden watermark
      ctx.font = '24px Syne, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillText('Made with ❤️ by duke.sol', width / 2, height - 40);

      const imageUrl = canvas.toDataURL('image/jpg');
      setGeneratedImage({
        url: imageUrl,
        text: inputText
      });

      incrementImageCount();
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage.url;
    link.download = `warden-protocol-for-${generatedImage.text.toLowerCase().replace(/\s+/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareToX = () => {
    if (!generatedImage) return;

    const text = `Warden is for ${generatedImage.text}. Create your own at`;
    const url = window.location.href;
    const shareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  };

  const shareToGitHub = () => {
    window.open('https://x.com/cryptoduke01', '_blank');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      generateImage();
    }
  };

  return (
    <div className="min-h-screen px-4 py-4 md:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">Warden Protocol</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            Your Crypto Co-Pilot - Create Personalized Warden Visual Themes
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="warden-card mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter word or phrase"
              className="warden-input"
            />
            <button
              onClick={generateImage}
              disabled={isLoading}
              className="warden-button"
            >
              {isLoading ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </motion.div>

        {/* Canvas Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="warden-card mb-8"
        >
          <div className="canvas-container">
            {generatedImage && (
              <img
                src={generatedImage.url}
                alt={`Warden is for ${generatedImage.text}`}
                className="canvas-image"
              />
            )}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col md:flex-row gap-4 justify-center mb-8"
        >
          <button onClick={handleDownload} className="warden-button action-button">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Download
          </button>

          <button onClick={shareToX} className="warden-button action-button">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Share to X
          </button>

          <button onClick={shareToGitHub} className="warden-button action-button">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Dev
          </button>
        </motion.div>

        {/* Counter */}
        <div className="text-center text-sm text-gray-400">
          <p>{imageCount} {imageCount === 1 ? 'image' : 'images'} generated and counting</p>
          <p className="text-center text-sm mt-4 text-[#CAFF94] font-syne">
            Made with ❤️ by <a href="https://x.com/cryptoduke01" className="underline text-white-500 hover:text-blue-white transition-colors duration-200" target="_blank" rel="noopener noreferrer">duke.sol</a>{" "}
          </p>

        </div>
      </div>

      {/* Vulgar Words Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3 className="modal-title">Access Denied</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="modal-close"
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <p>Sorry, that word or phrase is not allowed.</p>
                <p className="modal-subtitle">Please choose a different word to continue.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden canvas for image generation */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}

export default App;