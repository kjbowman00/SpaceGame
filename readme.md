#HexWars
##HexWars is a real-time multiplayer arcade shooter game
![Main Menu Screen](/public/images/main_menu_preview.png)

##Gameplay
###Goal
The goal of the game is to have a fun time blasting other ships
and to become the most powerful ship possible

###Orbs
Glowing orbs that the player can collect are found accross the map. 
Obtaining enough orbs will allow for a player to upgrade their ship.

###Upgrades
Various upgrades are availble by random chance. Sometimes the player will get rare or legendary upgrades
At level 5 and 10 there are specialty upgrades that make the player better at some things but worse in others.

##Server Model
The game uses a server authoritative state model to prevent cheating.
This naturally comes with input lag so there is client side prediction in place to give the
player a smoother experience.

An NGINX reverse proxy is in place to allow for multiple game servers to be run at once
