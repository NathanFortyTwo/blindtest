const audioFiles = [
    'songdir/music_files/audio.mp3',
    'songdir/music_files/sample.mp3'
];
let currentIndex = 0;

const audio = document.getElementById('audio');
const controlButton = document.getElementById('controlButton');
const nextButton = document.getElementById('nextButton');
console.log(`ws://${window.location.host}`)
const socket = new WebSocket(`ws://${window.location.host}`);

audio.src = audioFiles[currentIndex];

socket.onmessage = (event) => {
    try {
        const data = JSON.parse(event.data);
        if (data.action === 'toggle') {
            if (audio.paused) {
                audio.play();
                controlButton.classList.remove('stop');
                controlButton.classList.add('play');
                controlButton.textContent = 'Stop';
            } else {
                audio.pause();
                controlButton.classList.remove('play');
                controlButton.classList.add('stop');
                controlButton.textContent = 'Play';
            }
        } else if (data.action === 'next') {
            currentIndex = (currentIndex + 1) % audioFiles.length;
            audio.src = audioFiles[currentIndex];
            audio.play();
            controlButton.classList.remove('stop');
            controlButton.classList.add('play');
            controlButton.textContent = 'Stop';
        }
    } catch (error) {
        console.error('Error parsing JSON:', error);
    }
};

controlButton.addEventListener('click', () => {
    socket.send(JSON.stringify({
        action: 'toggle'
    }));
});

controlButton.addEventListener('click', () => {
    socket.send(JSON.stringify({
        user: document.getElementById('user').value,
    }));
});


nextButton.addEventListener('click', () => {
    socket.send(JSON.stringify({
        action: 'next'
    }));
});