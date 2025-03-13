import { GestureHandlerRootView } from "react-native-gesture-handler";
import SearchComponent from "../components/SearchScreenComponents.jsx/SearchComponent";


const SearchScreen = () => {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>  
            <SearchComponent/>
      </GestureHandlerRootView>

    );
};

export default SearchScreen;
