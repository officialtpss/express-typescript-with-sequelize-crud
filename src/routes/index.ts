
import userRoute from './user';

const initRoutes = (app: any) => {
  userRoute(app);
  app.use((req: any, res: any) => {
    res.status(404).send({
      url: req.originalUrl + ' not found',
    });
  });
};
export default initRoutes;
