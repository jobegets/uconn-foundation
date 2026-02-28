const PROD_URL = "https://uconn-foundation-backend.vercel.app/studymap";

export const getStudyMapChildren = async (prompt: string) => {
  const response = await fetch(`${PROD_URL}?prompt=${prompt}`);
  const data = await response.json();

  return data;
};
