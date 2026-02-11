import React, { useEffect, useState } from "react";
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
import { app } from "../../../../core/services/firebase/config";
import { RegisterScreenStyles } from "../../../screens/auth/RegisterScreen/RegisterScreen.styles";
import { autocompleteReactiveService, AutocompleteOption } from "../../../../core/services/reactive/autocompleteReactiveService";
import { Subscription } from "rxjs";

const db = getFirestore(app);
const collectionRef = collection(db, "categories");

interface AutocompleteCategoriesProps {
  aoSelecionar: (categoria: AutocompleteOption) => void;
}

const AutocompleteCategories = ({ aoSelecionar }: AutocompleteCategoriesProps) => {
  const [query, setQuery] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<AutocompleteOption[]>([]);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    // Carregar categorias do Firestore
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collectionRef);
        const lista = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as AutocompleteOption[];
        autocompleteReactiveService.setOptions(lista);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    };
    fetchData();

    // Subscribe aos observables reativos
    const subscriptions = new Subscription();

    subscriptions.add(
      autocompleteReactiveService.query$.subscribe(setQuery)
    );

    subscriptions.add(
      autocompleteReactiveService.filteredOptions$.subscribe(setFilteredOptions)
    );

    subscriptions.add(
      autocompleteReactiveService.showList$.subscribe(setShowList)
    );

    return () => {
      subscriptions.unsubscribe();
    };
  }, []);

  const handleSearch = (text: string) => {
    autocompleteReactiveService.setQuery(text);
  };

  const selecionarItem = (item: AutocompleteOption) => {
    autocompleteReactiveService.setQuery(item.nome);
    autocompleteReactiveService.setIsFocused(false);
    Keyboard.dismiss();
    aoSelecionar(item);
  };

  const handleFocus = () => {
    autocompleteReactiveService.setIsFocused(true);
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

      {showList && filteredOptions.length > 0 && (
        <View style={styles.dropdown}>
          <FlatList
            nestedScrollEnabled={true}
            data={filteredOptions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                activeOpacity={0.7}
                onPress={() => selecionarItem(item)}
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