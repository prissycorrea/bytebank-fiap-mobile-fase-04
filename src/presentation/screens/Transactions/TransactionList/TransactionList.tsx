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
import { LIGHT_BLUE, PRIMARY_BLUE, WHITE } from "@shared/utils/colors";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { ITransaction } from "@shared/types/transaction";

import { transactionListViewModel } from "../../../viewmodels/TransactionListViewModel";

const TransactionListScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { user } = useAuth();

  // Estados reativos do ViewModel (via hook centralizado para conveniência)
  const {
    filteredTransactions,
    uniqueCategories,
    searchText,
    categoryFilter,
    loading
  } = useReactiveTransactions();

  const [refreshing, setRefreshing] = React.useState(false);
  const ITEM_HEIGHT = 80;

  useFocusEffect(
    useCallback(() => {
      if (user) {
        transactionListViewModel.loadTransactions(user.uid);
      }
    }, [user])
  );

  const onRefresh = async () => {
    if (!user) return;
    setRefreshing(true);
    // O ViewModel já lida com a subscrição interna se necessário, 
    // ou podemos disparar via serviço reativo.
    transactionListViewModel.loadTransactions(user.uid);
    setRefreshing(false);
  };

  const renderListHeader = useCallback(() => (
    <View style={{ paddingHorizontal: 25, paddingTop: insets.top + 10 }}>
      <View style={TransactionCreateStyle.mainInput}>
        <TextInput
          style={RegisterScreenStyles.input}
          placeholder="Buscar transação"
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={(text) => transactionListViewModel.setSearchText(text)}
          autoCapitalize="words"
        />
      </View>

      <FlatList
        horizontal
        data={uniqueCategories}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        style={{ marginBottom: 15 }}
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
              }}
              onPress={() => {
                transactionListViewModel.setCategoryFilter(isSelected ? "" : item);
              }}
            >
              <Text style={{ color: isSelected ? WHITE : "#0F2C59" }}>{item}</Text>
            </TouchableOpacity>
          );
        }}
      />

      <Text style={[RegisterScreenStyles.title, { fontSize: 18, marginBottom: 10 }]}>
        Histórico de Transações
      </Text>
    </View>
  ), [searchText, uniqueCategories, categoryFilter, insets.top]);

  const renderItem = useCallback(({ item }: { item: ITransaction }) => (
    <TouchableOpacity
      style={{ marginHorizontal: 25, marginVertical: 8 }}
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
    <SafeAreaView style={{ flex: 1, backgroundColor: LIGHT_BLUE }} edges={["left", "right"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <FlatList
          data={filteredTransactions}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          getItemLayout={getItemLayout}
          ListHeaderComponent={renderListHeader}
          contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          // Otimizações de performance
          removeClippedSubviews={Platform.OS === 'android'}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          initialNumToRender={10}
          windowSize={10}
          ListEmptyComponent={
            <View
              style={{
                backgroundColor: LIGHT_BLUE,
                padding: 20,
                marginHorizontal: 20,
                alignItems: "center",
                borderRadius: 12,
              }}
            >
              <Text style={{ fontFamily: "Poppins_400Regular" }}>
                Não há transações para exibir.
              </Text>
            </View>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TransactionListScreen;