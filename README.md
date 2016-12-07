# govacontrol

## MJPG-Streamer installation
sudo apt-get install libjpeg8-dev imagemagick libv4l-dev
ln -s /usr/include/linux/videodev2.h /usr/include/linux/videodev.h
wget http://downloads.sourceforge.net/project/mjpg-streamer/mjpg-streamer/Sourcecode/mjpg-streamer-r63.tar.gz
tar -xvf mjpg-streamer-r63.tar.gz
cd mjpg-streamer-r63
make mjpg_streamer input_file.so input_uvc.so output_http.so
sudo cp mjpg_streamer /usr/local/bin
sudo cp output_http.so input_file.so input_uvc.so /usr/local/lib/
sudo cp -R www /usr/local/www
/usr/local/bin/mjpg_streamer -i "/usr/local/lib/input_uvc.so -y -r 320x240" -o "/usr/local/lib/output_http.so -w /usr/local/www"