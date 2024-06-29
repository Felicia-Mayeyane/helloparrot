const videoPreview = document.getElementById("videoPreview");
const startRecordingButton = document.getElementById("startRecording");
const stopRecordingButton = document.getElementById("stopRecording");
const downloadLink = document.getElementById("downloadLink");
const uploadForm = document.getElementById("uploadForm");
const videoDataInput = document.getElementById("videoData");

let mediaRecorder;
let recordedChunks = [];

// Event listeners
startRecordingButton.addEventListener("click", startRecording);
stopRecordingButton.addEventListener("click", stopRecording);
uploadForm.addEventListener("submit", uploadVideo);

// Function to initialize video preview from webcam
async function initializeVideoPreview() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoPreview.srcObject = stream;
    } catch (error) {
        console.error("Error initializing video preview:", error);
    }
}

// Function to start video recording
async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoPreview.srcObject = stream;
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };
        mediaRecorder.onstop = () => {
            const videoBlob = new Blob(recordedChunks, { type: "video/webm" });
            recordedChunks = [];
            const videoURL = URL.createObjectURL(videoBlob);
            downloadLink.href = videoURL;
            downloadLink.style.display = "block";
            downloadLink.download = "recorded-video.webm";
            const reader = new FileReader();
            reader.onloadend = () => {
                videoDataInput.value = reader.result;
                uploadForm.style.display = "block";
            };
            reader.readAsDataURL(videoBlob);
        };
        mediaRecorder.start();
        startRecordingButton.disabled = true;
        stopRecordingButton.disabled = false;
    } catch (error) {
        console.error("Error starting recording:", error);
    }
}

// Function to stop video recording
function stopRecording() {
    if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
        startRecordingButton.disabled = false;
        stopRecordingButton.disabled = true;
    }
}

// Function to upload recorded video
async function uploadVideo(event) {
    event.preventDefault();
    try {
        const response = await fetch('/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ videoData: videoDataInput.value }),
        });
        if (response.ok) {
            alert('Video uploaded successfully!');
        } else {
            alert('Video upload failed.');
        }
    } catch (error) {
        console.error('Error uploading video:', error);
    }
}

// Initialize video preview when the page loads
window.addEventListener("load", initializeVideoPreview);
