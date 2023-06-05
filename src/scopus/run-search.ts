interface runSearchParams {
  query: string[][],
  excludeKeywords: string[],
  fromYear: string | undefined,
  toYear: string | undefined,
  source: string | undefined,
}

export default async function runSearch({ query, excludeKeywords, fromYear, toYear, source }: runSearchParams) {
  console.log(query);
  console.log(excludeKeywords);
  console.log(fromYear);
  console.log(toYear);
  console.log(source);

  // 은혜님 TODO: Scopus API를 통해서 해당 Params들을 통해서 검색을 진행하고, 검색 결과를 반환하는 로직을 구현해주세요.
  // 참고로 source의 경우에는 은혜님 말처럼 응답을 반환한 후 내부에서 처리하시면 될 것 같습니다.
  // 만약 Scopus API에서 요구하는 정보가 Params에서 부족하거나 잘못된 형식(가령 Publish Date 범위)이 있다면, 카톡으로 바로 말씀해주세요.

  // 라우팅은 어떻게 할지 결정을 안해서 아직 구현하지 않았습니다. 
  // 굳이 결과를 반환하지 마시고 console.log로 찍고 끝내는 void 함수로 남겨두시면 될 것 같습니다.
  // 추후에 라우팅을 구현하고, 결과를 반환하는 함수로 제(한준규)가 바꾸겠습니다.
  // 대신에 추후 저희가 검색결과를 UI에 보여줄 때(표의 column)를 고려하여 반환할 데이터 형식을 결정해주세요. 

  alert('Unimplemented!');
}