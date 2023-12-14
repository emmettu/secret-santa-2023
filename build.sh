cd react-app
yarn build
rm -r ../server/static/*
cp -r build/* ../server/static
