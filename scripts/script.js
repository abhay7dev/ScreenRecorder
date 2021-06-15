if("chrome" in self) {
	console.clear();
	console.info("Modules scripts in XML documents are currently supported. See https://crbug.com/717643#c13");
}

const buttons = document.getElementById("buttons");
const start = document.getElementById("start");
const stop = document.getElementById("stop");
const video = document.querySelector("video");
let recorder, stream;

let download = null;

start.addEventListener("click", async () => {
	start.setAttribute("disabled", "disabled");
	stop.removeAttribute("disabled");

	if(download) {
		buttons.removeChild(download);
	}

	stream = await navigator.mediaDevices.getDisplayMedia({
		video: {
			mediaSource: "screen"
		}
	}).catch(err => {
		console.log(err);
		stop.setAttribute("disabled", "disabled");
		start.removeAttribute("disabled");
	});
	recorder = new MediaRecorder(stream);

	const chunks = [];

	recorder.ondataavailable = e => chunks.push(e.data);

	recorder.onstop = (e) => {
		const completeBlob = new Blob(chunks, { type: chunks[0].type });
		video.src = URL.createObjectURL(completeBlob);
		
		download = document.createElement("button");
		download.addEventListener("click", () => {
			window.open(video.src);
		});
		//download.innerText = "Download";
		download.appendChild(document.createTextNode("Download"));
		buttons.appendChild(download);
		
		stop.setAttribute("disabled", "disabled");
		start.removeAttribute("disabled");
	};

	recorder.start();
});

stop.addEventListener("click", () => {
	stop.setAttribute("disabled", "disabled");
	start.removeAttribute("disabled");
	
	recorder.stop();
	stream.getVideoTracks()[0].stop();
});