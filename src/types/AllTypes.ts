type CatFacts = {
  fact: string;
  length: number;
};

type CatFactsApiResponse = {
  data: CatFacts[];
  meta: {
    current_page: number;
  };
};
