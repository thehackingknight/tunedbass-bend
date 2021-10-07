from flask import Flask, redirect, request
import youtube_dl

url = 'https://www.youtube.com/watch?v=JaO6fPA99Hg&ab_channel=iCoder'
app = Flask(__name__)

@app.route('/')
def index():
    return 'Hello World'
@app.route('/download')
def download():
    with youtube_dl.YoutubeDL() as ytdl:
        info = ytdl.extract_info(url, download=False)
        # print(info)
        try:
        	download_link = info["entries"][-1]["formats"][-1]["url"]
        except:
        	download_link = info["formats"][-1]["url"]
        return redirect(download_link+"&dl=1")

if __name__ == '__main__':
    app.run(debug=True)