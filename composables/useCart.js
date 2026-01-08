/* Dette composable ("useCart") håndterer hele logikken omkring indkøbskurven i webshoppen. Det sørger for at tilføje, fjerne, opdatere og beregne produkter i kurven.*/
export const useCart = () => {
  /* useState bruges til at oprette en delt, reaktiv tilstand (state) for hele webshoppen, det gælder både sider og komponenter. Her opretter vi en global variabel "cart", som starter som et tomt array. Det betyder, at alle komponenter, der bruger "useCart", deler den samme kurv. */
  const cart = useState("cart", () => []);

  /* addToCart funktionen tilføjer et produkt til kurven. Først tjekker vi, om produktet allerede findes i kurven (samme id, størrelse og farve). Hvis det gør, øges mængden i stedet for at tilføje et nyt element. Hvis ikke, pushes produktet som et nyt objekt ind i arrayet, med ekstra oplysninger som "quantity", "size" og "color". Vi tilføjer også et unikt "cartItemId" ved at kombinere tid og tilfældigt tal, som giver hvert produkt et unikt ID. */
  const addToCart = (product, quantity = 1, size = null, color = null) => {
    const existingItem = cart.value.find(
      (item) =>
        item.id === product.id && item.size === size && item.color === color
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.value.push({
        ...product, // spreder alle produktets egenskaber ind i det nye objekt
        quantity,
        size,
        color,
        cartItemId: Date.now() + Math.random(),
      });
    }
  };

  /* updateQuantity bruges til at ændre antallet af et specifikt produkt i kurven. Den finder produktet ud fra dets unikke "cartItemId" og opdaterer "quantity". Den sikrer også, at mængden altid er mellem 1 og 99 for at undgå ugyldige værdier hvor kunden bare kan trykke 99+ for at skabe unædvendig trafik og ikke realistiske ordre */
  const updateQuantity = (cartItemId, quantity) => {
    const item = cart.value.find((item) => item.cartItemId === cartItemId);
    if (item && quantity > 0 && quantity <= 99) {
      item.quantity = quantity;
    }
  };

  /* removeFromCart fjerner et produkt fra kurven helt. Den filtrerer kurven og returnerer et nyt array uden det matchende "cartItemId". Den tjekker om cartitemId er lig med det cartItemId vi gerne vil fjerne, hvis det ikke er lig med hinanden bliver de i arrayet, hvis de matcher bliver de fjernet */
  const removeFromCart = (cartItemId) => {
    cart.value = cart.value.filter((item) => item.cartItemId !== cartItemId);
  };

  /* cartTotal er en computed property, som automatisk beregner den samlede pris for alle produkter i kurven. Den ganger hvert produkts pris med dets mængde og lægger det sammen. */
  const cartTotal = computed(() => {
    return cart.value.reduce((total, item) => {
      return total + item.Pris * item.quantity;
    }, 0);
  });

  /* cartCount er en anden computed property, som beregner det samlede antal varer i kurven. Den summerer alle produkters "quantity" for at vise det samlede antal enheder */
  const cartCount = computed(() => {
    return cart.value.reduce((count, item) => count + item.quantity, 0);
  });

  /* clearCart tømmer hele kurven ved at nulstille arrayet til tomt. Bruges typisk efter betaling eller når brugeren trykker på "ryd kurv". */
  const clearCart = () => {
    cart.value = [];
  };

  /* og det sidste i processen er "return" som returnere alle funktioner og værdier,så andre komponenter i websiden kan bruge dem. */
  return {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    cartTotal,
    cartCount,
    clearCart,
  };
};
