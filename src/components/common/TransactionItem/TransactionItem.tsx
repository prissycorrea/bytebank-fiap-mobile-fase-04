import React, { memo } from "react";
import { Text, View } from "react-native";
import { ITransaction } from "../../../types/transaction";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { TransactionItemStyles } from "./TransactionItem.styles";
import { formatCurrency, formatDate } from "../../../utils/formatters";

const TransactionItem: React.FC<{ transaction: ITransaction }> = memo(({
  transaction,
}) => {
  if (!transaction) {
    return null;
  }

  const isIncome = transaction.transactionType === "INCOME";
  const date = transaction.createdAt ? new Date(transaction.createdAt) : null;
  const formattedDate =
    date && !isNaN(date.getTime()) ? date : null;

  return (
    <View style={TransactionItemStyles.container}>
        <MaterialCommunityIcons
          style={[
            isIncome
              ? TransactionItemStyles.income
              : TransactionItemStyles.expense,
            TransactionItemStyles.icon
          ]}
          name={isIncome ? "arrow-up-thin" : "arrow-down-thin"}
          size={24}
        />
      <View style={TransactionItemStyles.containerLabel}>
        <Text style={TransactionItemStyles.label}>
          {transaction.description
            ? transaction.description
            : transaction.category}
        </Text>
        <Text style={TransactionItemStyles.date}>{formatDate(formattedDate)}</Text>
      </View>
      <Text style={TransactionItemStyles.price}>{formatCurrency(transaction.price, false)}</Text>
    </View>
  );
}, (prevProps, nextProps) => {
  // Comparação customizada para evitar re-renders desnecessários
  return (
    prevProps.transaction.id === nextProps.transaction.id &&
    prevProps.transaction.description === nextProps.transaction.description &&
    prevProps.transaction.price === nextProps.transaction.price &&
    prevProps.transaction.createdAt === nextProps.transaction.createdAt &&
    prevProps.transaction.transactionType === nextProps.transaction.transactionType
  );
});

TransactionItem.displayName = 'TransactionItem';

export default TransactionItem;