import { StyleSheet } from "react-native";
import { GRAY_DARK, LIGHT_BLUE } from "@shared/utils/colors";

export const TransactionWidgetStyles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        paddingHorizontal: 25,
        paddingBottom: 25,
        backgroundColor: LIGHT_BLUE,
    },
})