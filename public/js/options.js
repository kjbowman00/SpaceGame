var OPTIONS = {};
OPTIONS.playerTrailQuality = 2; //2 means best. 1 means basic circles. 0 is nothing
OPTIONS.orbTrailQuality = 2;
OPTIONS.volume = 0.5;
OPTIONS.musicVolume = 0.5;

function openOptions() {
	document.getElementById("open_options").style.display = "none";
	document.getElementById("options_box").style.display = "block";
}

function closeOptions() {
	document.getElementById("open_options").style.display = "block";
	document.getElementById("options_box").style.display = "none";
}

function changePlayerTrailQuality(num) {
	OPTIONS.playerTrailQuality = num;
}
function changeOrbTrailQuality(num) {
	OPTIONS.orbTrailQuality = num;
}

function changeMusicVolume() {
	OPTIONS.musicVolume = document.getElementById("music_volume").value / 100;
	Sounds.changeMusicVolume(OPTIONS.musicVolume);
}
function changeSoundVolume() {
	OPTIONS.volume = document.getElementById("sound_volume").value / 100;
	Sounds.changeVolume(OPTIONS.volume);
}