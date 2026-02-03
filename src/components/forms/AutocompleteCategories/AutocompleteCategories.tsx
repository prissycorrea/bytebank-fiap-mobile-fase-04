import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from "react-native";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { app } from "../../../services/firebase/config";
import { RegisterScreenStyles } from "../../../screens/auth/RegisterScreen/RegisterScreen.styles";

const db = getFirestore(app);
const collectionRef = collection(db, "categories");

const AutocompleteCategories = ({ aoSelecionar }: any) => {
  const [query, setQuery] = useState("");
  const [dadosFull, setDadosFull] = useState<any>([]);
  const [dadosFiltrados, setDadosFiltrados] = useState([]);
  const [showList, setShowList] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collectionRef);
        const lista = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDadosFull(lista);
        // Se o campo está focado e há dados, mostra a lista
        if (isFocused && lista.length > 0) {
          setDadosFiltrados(lista as any);
          setShowList(true);
        }
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    };
    fetchData();
  }, [isFocused]);

  const handleSearch = (text: any) => {
    setQuery(text);
    if (text.length > 0) {
      const filtrados = dadosFull.filter((item: any) =>
        item.nome.toLowerCase().includes(text.toLowerCase())
      );
      setDadosFiltrados(filtrados);
      setShowList(true);
    } else {
      // Se não há texto, mostra todas as categorias
      setDadosFiltrados(dadosFull);
      setShowList(isFocused && dadosFull.length > 0);
    }
  };

  const selecionarItem = (item: any) => {
    console.log("Selecionando item:", item.nome); // Debug
    setQuery(item.nome);
    setShowList(false);
    setIsFocused(false);
    Keyboard.dismiss();
    if (aoSelecionar) {
      aoSelecionar(item);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    // Quando foca, mostra todas as categorias se não há texto digitado
    if (query.length === 0 && dadosFull.length > 0) {
      setDadosFiltrados(dadosFull);
      setShowList(true);
    } else if (query.length > 0) {
      // Se já há texto, mostra os resultados filtrados
      const filtrados = dadosFull.filter((item: any) =>
        item.nome.toLowerCase().includes(query.toLowerCase())
      );
      setDadosFiltrados(filtrados);
      setShowList(true);
    }
  };

  return (
    <View>
      <TextInput
        style={RegisterScreenStyles.input}
        placeholder="Selecione uma categoria"
        placeholderTextColor="#999"
        value={query}
        onChangeText={handleSearch}
        onFocus={handleFocus}
        autoCapitalize="words"
      />

      {showList && dadosFiltrados.length > 0 && (
        <View style={styles.dropdown}>
          <FlatList
            nestedScrollEnabled={true}
            data={dadosFiltrados}
            keyExtractor={(item: any) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                activeOpacity={0.7}
                onPress={() => {
                  console.log("Pressionado:", item.nome); // Debug
                  selecionarItem(item);
                }}
              >
                <Text>{item.nome}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  dropdown: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    maxHeight: 200,
    borderRadius: 8,
    marginTop: 2,
    elevation: 3,
    shadowColor: "#000",
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});

export default AutocompleteCategories;
