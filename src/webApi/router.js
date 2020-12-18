let routes = [];

export default {
  route: async (req) => {
    const matchedRoutes = routes.filter(x => x.validatorFn(req));
    if(matchedRoutes.length === 0) return false;
    if(matchedRoutes.length === 1){
      return await matchedRoutes[0].executorFn(req);
    }else{
      console.error("Multiple routes for request found", req, matchedRoutes);
      throw new Error("Multiple routes for request found");
    }
  },
  register: (validatorFn, executorFn) => {
    routes.push({
      validatorFn: validatorFn,
      executorFn: executorFn
    });
  }
}