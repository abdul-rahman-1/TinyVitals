# c Frontend

> AI-Powered Newborn Health Screening Tool - Frontend Application

## 📋 Overview

TinyVitals is a React-based web application designed to help detect visible health issues in newborns, such as jaundice and malnutrition, using just a photo captured from a smartphone or computer. This frontend application provides an intuitive interface for image capture, upload, and real-time AI analysis display.

## ✨ Features

- 📸 **Camera Capture**: Real-time camera access to capture newborn photos
- 📤 **Image Upload**: Upload existing images from your device
- 🤖 **AI Analysis**: Send images to backend for ML-powered health screening
- 📊 **Result Display**: Beautiful, formatted display of analysis results
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- 🎨 **Modern UI/UX**: Built with Bootstrap 5 and custom CSS animations
- 🖨️ **Print Support**: Print analysis reports for record-keeping

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x or higher
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TinyVitals-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set your backend API URL:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run linting (placeholder)
- `npm test` - Run tests (placeholder)

## 🏗️ Project Structure

```
TinyVitals-frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── ImageCapture.jsx      # Camera capture component
│   │   ├── ImageCapture.css
│   │   ├── ResultDisplay.jsx     # Results display component
│   │   └── ResultDisplay.css
│   ├── services/        # API services
│   │   └── api.js       # Backend API integration
│   ├── App.jsx          # Main App component
│   ├── App.css          # App styles
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── package.json         # Project dependencies
└── README.md            # This file
```

## 🔌 Backend Integration

The frontend communicates with a backend API that accepts images in base64 format and returns analysis results.

### Expected API Endpoint

**POST** `/api/analyze`

**Request Body:**
```json
{
  "image": "base64_encoded_image_data"
}
```

**Response:**
```json
{
  "text": "Analysis summary text",
  "report": {
    "condition": "Normal/Jaundice/etc",
    "confidence": 0.95,
    "recommendations": ["Consult a doctor", "Monitor symptoms"]
  }
}
```

### Configuring Backend URL

Set the backend URL in your `.env` file:
```env
VITE_API_URL=http://your-backend-url/api
```

## 🎨 UI/UX Features

- **Gradient Backgrounds**: Beautiful purple gradient theme
- **Smooth Animations**: CSS animations for better user experience
- **Bootstrap 5 Components**: Responsive cards, buttons, and alerts
- **Bootstrap Icons**: Modern iconography throughout the app
- **Glass Morphism**: Frosted glass effects on headers and footers
- **Mobile-First Design**: Optimized for mobile devices

## 🔒 Security Considerations

- Camera permissions are requested before access
- Image data is only sent to the configured backend API
- No client-side storage of sensitive health data
- HTTPS recommended for production deployment

## 📱 Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Note:** Camera access requires HTTPS in production (except localhost)

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory. Deploy this folder to your hosting service:

- **Vercel**: `vercel deploy`
- **Netlify**: Connect your repository
- **AWS S3 + CloudFront**: Upload `dist/` to S3
- **GitHub Pages**: Use GitHub Actions workflow

### Environment Variables for Production

Make sure to set `VITE_API_URL` to your production backend URL in your hosting platform's environment settings.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## ⚠️ Disclaimer

**This tool is for screening purposes only and should not replace professional medical diagnosis.** Always consult qualified healthcare professionals for proper medical diagnosis and treatment. Do not make medical decisions based solely on this automated assessment.

## 🙏 Acknowledgments

- Built with [React](https://react.dev/) and [Vite](https://vitejs.dev/)
- Styled with [Bootstrap 5](https://getbootstrap.com/)
- Icons from [Bootstrap Icons](https://icons.getbootstrap.com/)
- Powered by Google ML & GenAI

## 📞 Support

For questions, issues, or feature requests, please open an issue on GitHub.

---

**© 2025 TinyVitals. Powered by Google ML & GenAI**
