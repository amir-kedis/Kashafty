const checkRankMiddleware = (...ranks) => {
  return async (req, res, next) => {
    const captainRank = req.captain.type;
    for (const rank of ranks) {
      if (rank === captainRank) {
        next();
        return;
      }
    }
    return res.status(403).json({ message: "Forbidden" });
  };
};

export default checkRankMiddleware;
