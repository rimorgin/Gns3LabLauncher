export const generateRedisUserKey = (keyName: string) => {
  return `gns3labuser:session:${keyName}`;
};
export const generateRedisRouteKey = (routeName: string, keyName?: string) => {
  if (!keyName || keyName.trim() === "") {
    return `gns3labroutes:cache:${routeName}`;
  }
  return `gns3labroutes:cache:${routeName}@${keyName}`;
};
