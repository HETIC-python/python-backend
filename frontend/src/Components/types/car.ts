export interface Car {
  id: number;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  picture: string;
  km? : number;
  type?: string;
  code?: string;
  engine?: string;
  transmission?: string;
  horsepower?: number;
  topSpeed?: number;
  availability?: boolean;
  description?: string;
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
