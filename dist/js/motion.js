"use strict";

async function loadVideos() {
  const gallery = document.querySelector("#videos");
  const status = document.querySelector("#status");
  let playbackEnabled = false;
  let activeVideo = null;

  function pauseOthers(current) {
    for (const video of gallery.querySelectorAll("video")) {
      if (video !== current) video.pause();
    }
  }

  function playActiveVideo() {
    if (!playbackEnabled || !activeVideo || document.hidden) return;
    // Keep native play controls available if the browser blocks sound playback.
    activeVideo.play().catch(() => {});
  }

  try {
    const response = await fetch("/motion/videos.json");
    if (!response.ok) throw new Error("Could not load videos");
    const videos = await response.json();
    const visibility = new Map();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        visibility.set(entry.target, entry.intersectionRatio);
      }

      let nextVideo = null;
      let highestRatio = 0.6;
      for (const [reel, ratio] of visibility) {
        if (ratio >= 0.6 && (!nextVideo || ratio > highestRatio)) {
          nextVideo = reel.querySelector("video");
          highestRatio = ratio;
        }
      }

      const changed = nextVideo !== activeVideo;
      activeVideo = nextVideo;
      pauseOthers(activeVideo);
      if (changed) playActiveVideo();
    }, { root: gallery, threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] });

    for (const [index, item] of videos.entries()) {
      const reel = document.createElement("section");
      reel.className = "reel";
      const video = document.createElement("video");
      video.src = item.src;
      video.controls = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = "metadata";
      video.width = 1080;
      video.height = 1920;
      video.setAttribute("aria-label", item.title || `Motion video ${index + 1}`);
      if (item.poster) video.poster = item.poster;
      video.addEventListener("play", () => {
        if (document.hidden || video !== activeVideo) {
          video.pause();
          return;
        }
        playbackEnabled = true;
        pauseOthers(video);
      });
      video.addEventListener("playing", () => video.classList.add("is-playing"));
      for (const event of ["pause", "waiting", "ended"]) {
        video.addEventListener(event, () => video.classList.remove("is-playing"));
      }
      reel.appendChild(video);
      gallery.appendChild(reel);
      observer.observe(reel);
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) pauseOthers(null);
      else playActiveVideo();
    });

    status.hidden = videos.length > 0;
    status.textContent = videos.length ? "" : "No videos yet.";
  } catch (error) {
    status.hidden = false;
    status.textContent = "Videos couldn’t be loaded. Please try again later.";
  }
}

loadVideos();
