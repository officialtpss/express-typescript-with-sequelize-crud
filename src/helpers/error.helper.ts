
const sendError400 = (error:any , res:any) => {
  if (error.errors !== void 0) {
    res.status(400).send({
      message: error.errors[0].message,
    });
    return false;
  }
  if (error.message) {
    res.status(400).send({ message: error.message });
    return;
  }
  res.status(400).send(error);
};

const sendError400WithFlag = (error:any, res:any) => {
  res.status(400).send(error);
};

const sendError401 = (res:any) => {
  res.status(401).send({ message: 'Unauthorized' });
};

export default  {
  sendError400,
  sendError400WithFlag,
  sendError401,
};
