import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import ImageKit from 'imagekit'

dotenv.config()

const app = express()
const port = parseInt(process.env.PORT || '8000', 10)

app.use(cors({
    origin: process.env.CLIENT_URL,
}))

const imagekitInstance = new ImageKit({
    urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY
});

app.get('/api/upload', (req, res) => {
    const result = imagekitInstance.getAuthenticationParameters();
    res.send(result);
})

app.listen(port, 'localhost', () => {
    console.log(`Server running successfully on http://localhost:${port}`)
}).on('error', (err) => {
    if (err.code === 'EACCES') {
        console.log(`Port ${port} requires elevated privileges. Try these solutions:
        1. Use a port number above 1024
        2. Run the command prompt as administrator`)
    } else {
        console.error('Server error:', err)
    }
})