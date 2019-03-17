interface person {
  name: string;
  age: number;
}

const tom: person = {
  name: 'Tom',
  age: 25,
};

if (tom.age === 25) {
  console.log('2');
}
