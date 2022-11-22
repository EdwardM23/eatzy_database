import jwt from "jsonwebtoken";

function getUserId(token) {
  const authHeader = req.params.token;
  console.log(authHeader);
  if (!authHeader) {
    return res.status(401).json({ message: "not authenticated" });
  }
  token = authHeader.split(" ")[0];
  console.log(token);
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "secret");
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "could not decode the token" });
  }
  if (!decodedToken) {
    res.status(401).json({ message: "unauthorized" });
  } else {
    res.status(200).json({ message: "here is your resource" });
  }
}
