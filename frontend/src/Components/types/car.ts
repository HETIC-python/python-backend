export interface Car {
  id: number;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  imageUrl: string;
}

export interface CarDetails extends Car {
  description: string;
  specs: {
    engine: string;
    transmission: string;
    horsepower: number;
    acceleration: string;
    topSpeed: string;
  };
}
