import React, { useCallback, useEffect, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useAuth } from "../../../hooks/useAuth";
import { useReactiveTransactions } from "../../../hooks/useReactiveTransactions";
import TransactionItem from "../../../components/common/TransactionItem/TransactionItem";
import { TransactionCreateStyle } from "../TransactionCreate/TransactionCreate.styles";
import { RegisterScreenStyles } from "../../auth/RegisterScreen/RegisterScreen.styles";
import { LIGHT_BLUE, PRIMARY_BLUE, WHITE } from "../../../utils/colors";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { ITransaction } from "../../../types/transaction";

const TransactionListScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const {
    filteredTransactions,
    uniqueCategories,
    searchText,
    categoryFilter,
    loading,
    setSearchText,
    setCategoryFilter,
    loadTransactions,
  } = useReactiveTransactions();
  const [refreshing, setRefreshing] = React.useState(false);
  const ITEM_HEIGHT = 80;

  useFocusEffect(
    useCallback(() => {
      if (user) {
        loadTransactions(user.uid).subscribe();
      }
    }, [user])
  );

  const onRefresh = async () => {
    if (!user) return;
    setRefreshing(true);
    loadTransactions(user.uid).subscribe({
      complete: () => setRefreshing(false),
    });
  };

  const listHeader = useMemo(() => {
    return (
      <View style={{ paddingHorizontal: 20 }}>
        <View style={TransactionCreateStyle.mainInput}>
          <TextInput
            style={RegisterScreenStyles.input}
            placeholder="Buscar transação"
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
            autoCapitalize="words"
          />
        </View>
  
        <FlatList
          horizontal
          data={uniqueCategories}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const isSelected = item === categoryFilter;
            return (
              <TouchableOpacity
                style={{
                  borderColor: isSelected ? "#009BE9" : "#0F2C59",
                  backgroundColor: isSelected ? "#009BE9" : "transparent",
                  borderWidth: 1,
                  borderRadius: 20,
                  paddingHorizontal: 20,
                  paddingVertical: 5,
                  marginRight: 10,
                  marginBottom: 25,
                }}
                onPress={() => {
                  setCategoryFilter(isSelected ? "" : item);
                }}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  }, [searchText, uniqueCategories, categoryFilter, setSearchText, setCategoryFilter]);

  const renderItem = useCallback(({ item }: { item: ITransaction }) => (
    <TouchableOpacity
      style={{ marginVertical: 10 }}
      onPress={() =>
        navigation.navigate("TransactionDetails", { transactionId: item.id })
      }
    >
      <TransactionItem transaction={item} />
    </TouchableOpacity>
  ), [navigation]);
  
  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    []
  );
  
  const keyExtractor = useCallback((item: ITransaction) => item.id, []);

  return (
    <SafeAreaView style={TransactionCreateStyle.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          flex: 1,
        }}
      >
        {listHeader}

        <View
          style={[TransactionCreateStyle.container, { paddingTop: insets.top }]}
        >
         <FlatList
  data={filteredTransactions}
  keyExtractor={keyExtractor}
  renderItem={renderItem}
  getItemLayout={getItemLayout}
  contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
  showsVerticalScrollIndicator={false}
  refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  }
  // Otimizações de performance
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
  initialNumToRender={10}
  windowSize={10}
  ListEmptyComponent={
    <View
      style={{
        backgroundColor: LIGHT_BLUE,
        padding: 20,
        alignItems: "center",
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        marginBottom: 24,
      }}
    >
      <Text style={{ fontFamily: "Poppins_400Regular" }}>
        Não há transações para exibir.
      </Text>
    </View>
  }
/>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TransactionListScreen;