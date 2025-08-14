pm2 start "yarn run start:dev" --name gns3lablauncher

#pm2 start "yarn run start:dev" --name gns3-lab-launcher --watch --ignore-watch="node_modules" --interpreter tsx --interpreter-args "--require tsconfig-paths/register" --restart-delay 1000