export const askRagQuestion = async (question: string): Promise<string> => {
    const token = localStorage.getItem("token");
  
    const response = await fetch("http://localhost:5000/api/rag", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ question }),
    });
  
    if (!response.ok) {
      throw new Error("Erreur lors de l’appel à l’API");
    }
  
    const data = await response.json();
    return data.response; // Assure-toi que le backend retourne bien { response: "..." }
  };
  