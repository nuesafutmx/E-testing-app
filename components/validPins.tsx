import { getPins } from "@/actions/getPins"

const fetchValidPins = async () => {
  const validPins = await getPins();
  console.log(validPins);
  return validPins;
};

export default fetchValidPins;
