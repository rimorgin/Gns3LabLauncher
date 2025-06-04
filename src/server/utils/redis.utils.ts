export const generateRedisUserKey = (keyName: string) => {
  return `gns3labuser:session:${keyName}`;
};
export const generateRedisRouteKey = (routeName: string, keyName: string) => {
  return `gns3labroutes:cache:${routeName}@${keyName}`;
};
