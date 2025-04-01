#!/bin/sh

#para que sea ejecutable el ./github.sh
#chmod +x gitpull.sh

#saber ruta repositorio
git config --get remote.origin.url

#para descargar cambios
git pull

sudo chmod 777 -R writable/