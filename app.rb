require 'sinatra'

get '/' do
  File.read(File.join('public', 'index.html'))
end

get '/motion/?' do
  File.read(File.join('public/motion', 'index.html'))
end
