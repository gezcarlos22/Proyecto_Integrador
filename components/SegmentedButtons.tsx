import * as React from 'react';
import { SafeAreaView, StyleSheet, View, ScrollView } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { CardBook } from './CardBook';
import { useFavoritos } from '@/contexts/FavoritosContext';
import { useLibrosSubidos } from '@/contexts/LibrosSubidosContext';
import { ConfirmModal } from '@/components/ConfirmModal';

export const Segmented = () => {
  const [value, setValue] = React.useState('biblioteca');
  const { librosFavoritos } = useFavoritos();
  const { librosSubidos, eliminarLibro } = useLibrosSubidos();
  
  // Estados para el modal de confirmación
  const [modalVisible, setModalVisible] = React.useState(false);
  const [libroAEliminar, setLibroAEliminar] = React.useState<string | null>(null);

  // Función para mostrar el modal de confirmación
  const showDialog = (id: string) => {
    setLibroAEliminar(id);
    setModalVisible(true);
  };

  // Función para confirmar la eliminación
  const confirmarEliminacion = async () => {
    if (libroAEliminar) {
      try {
        await eliminarLibro(libroAEliminar);
      } catch (error) {
        console.error("Error al eliminar el libro:", error);
      }
    }
    setModalVisible(false);
  };

  // Función para eliminar favoritos duplicados por título
  const getFavoritosUnicos = () => {
    const seen = new Set();
    return librosFavoritos.filter(libro => {
      const duplicate = seen.has(libro.titulo);
      seen.add(libro.titulo);
      return !duplicate;
    });
  };

  const renderCards = () => {
    if (value === 'favoritos') {
      const favoritosUnicos = getFavoritosUnicos();
      
      return favoritosUnicos.map((libro, index) => (
        <CardBook 
          key={`favorito-${index}`} 
          colorCard="rgba(255, 255, 255,0.6)"
          imagen={libro.imagen}
          titulo={libro.titulo}
          precio={libro.precio}
          autor={libro.autor}
          descripcion={libro.descripcion}
          portada={libro.portada}
          genero={libro.genero}
          paginas={libro.paginas}
          anio={libro.anio}
          lenguaje={libro.lenguaje}
        />
      ));
    } else {
      // Renderizar los libros subidos en Mi Biblioteca
      return librosSubidos.map((libro) => (
        <CardBook 
          key={`subido-${libro.id}`}
          colorCard="rgba(255, 255, 255,0.6)"
          imagen={libro.imagen}
          titulo={libro.titulo}
          precio={parseFloat(libro.precio)}
          autor={libro.autor}
          descripcion={libro.descripcion}
          portada={libro.imagen}
          genero={libro.genero}
          paginas={parseInt(libro.paginas)}
          anio={parseInt(libro.anio)}
          lenguaje={libro.lenguaje}
          icono="trash-alt"
          onPress={() => showDialog(libro.id)}
        />
      ));
    }
  };

  return (
    <>
      <SegmentedButtons
        theme={{
          colors: {
            primary: "black",
            onSecondaryContainer: "black",
            secondaryContainer: "#dadada",
            onSurface: "#dadada",
            outline: "#dadada"
          }
        }}
        value={value}
        onValueChange={setValue}
        buttons={[
          {
            value: 'biblioteca',
            label: 'Mi Biblioteca',
          },
          {
            value: 'favoritos',
            label: 'Favoritos',
          },
        ]}
      />
      
      <ScrollView>
        <View style={styles.cardsContainer}>   
          {renderCards()}
        </View>
      </ScrollView>

      {/* Modal de confirmación para eliminar libro */}
      <ConfirmModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onConfirm={confirmarEliminacion}
        title="Eliminar libro"
        message="¿Estás seguro que deseas eliminar este libro de tu biblioteca?"
        icon="trash-alt"
        confirmText="Eliminar"
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: "wrap",
    gap: 20,
    justifyContent: "center", 
    marginTop: 10,
    marginBottom:70,
  },
});