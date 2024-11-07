// shipping-data-source.ts

// Define the shape of the destination and contents arguments
interface Destination {
  city?: string;
  country?: string;
  postalCode?: string;
}

interface OrderLine {
  // Define order line properties based on your requirements
  productId?: string;
  quantity: number;
  // Add any additional properties if needed
}

// Define the return type for getRate
interface ShippingRate {
  rate: number; // in cents
  deliveryDate: Date;
  courier: string;
}

// Define the rates for each location in a TypeScript-friendly way
const locationRates: Record<string, number> = {
  "23 DE ENERO": 3.5,
  "ANDRES ELOY BLANCO": 2,
  ARAGUAMA: 2,
  "BASE ARAGUA": 2.5,
  "BASE SUCRE": 5,
  "BRISAS DEL LAGO": 5,
  CAGUA: 10,
  CALICANTO: 3.5,
  CAMBURITO: 4,
  "CAMPO ALEGRE": 2,
  CANDELARIA: 6,
  CANTARRANA: 4,
  "CAÑA DE AZUCAR": 5,
  CASONA: 4.5,
  "CASTAÑO (HASTA HOTEL PIPO)": 6,
  "CC LAS AMERICAS": 3,
  CENTRO: 3.5,
  "DIGA CENTER": 4,
  "EL LIMON": 6,
  FARINACHI: 3.5,
  "GALERIA PLAZA": 3,
  GLOBAL: 2,
  "GRAN BAZAR": 2.5,
  GUASIMAL: 3.5,
  "HYPER JUMBO": 2.5,
  INDEPENDENCIA: 2.5,
  "LA ARBOLEDA": 3.5,
  "LA BARRACA": 2,
  "LA FLORESTA": 3.5,
  "LA SOLEDAD": 3,
  "LAS ACACIAS": 2,
  "LOA AVIADORES": 4,
  "LOS OLIVOS": 2.5,
  "LOS SAMANES": 2,
  MACARO: 7,
  "MARACAY PLAZA": 2,
  MARACAYA: 2,
  "MATA REDONDA": 2,
  "MONTAÑA FRESCA": 4,
  "PALO NEGRO": 6,
  PARAPARAL: 4,
  "PARQUE ARAGUA": 2,
  PIÑONAL: 2,
  REDVITAL: 4.5,
  "SAN CARLOS": 2,
  "SAN JACINTO": 3.5,
  "SAN JOSE": 2,
  "SAN RAFAEL": 2,
  "SAN VICENTE": 4,
  "SANTA CRUZ": 8,
  "SANTA RITA": 4,
  "SANTA ROSA": 3,
  "SOROCAIMA 1": 4.5,
  TERMINAL: 2,
  TURMERO: 8,
  UNICENTRO: 2.5,
};

// Define the shipping data source with types
export const shippingDataSource = {
  async getRate({ destination, contents }: { destination: Destination; contents: OrderLine[] }): Promise<ShippingRate> {
    const { city } = destination;

    // Lookup the rate based on the city
    const rate = locationRates[city || ""];
    if (rate === undefined) {
      throw new Error(`Shipping rate not found for location: ${city}`);
    }

    // Set a default delivery date of 2 days from now
    const deliveryDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    const courier = "Local Courier";

    return {
      rate: rate * 100, // Convert to cents
      deliveryDate,
      courier,
    };
  },
};
