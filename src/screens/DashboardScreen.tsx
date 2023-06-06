import { Text, View, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import Icon from "react-native-vector-icons/MaterialIcons";
import { DonutChart } from "react-native-circular-chart";
import { colors } from '../constants';
import { useVisita, useCliente, useUsuario, useTarea } from '../store';

export const DashboardScreen = () => {
    const { width } = useWindowDimensions();
    const usuario = useUsuario(e => e.usuario);
    const clientes = useCliente(e => e.clientes);
    const visitas = useVisita(e => e.visitas);
    const tareas = useTarea(e => e.tareas);
    const completadas = tareas.filter(x => x.completada).length;
    const pendientes = tareas.filter(x => !x.completada).length;

    const clientesAsignados = [...new Set(clientes.map(item => item.id))];
  
    return (
        <ScrollView style={{ padding: 15 }}>
            <View>
                <Text style={{ color: "black", fontWeight: "bold", fontSize: 30 }}>Bienvenido</Text>
                <Text style={{ color: "black", fontSize: 18 }}>{usuario}</Text>
            </View>
            <View style={style.cardContainer}>
                <View>
                    <Text style={{ color: "black", fontWeight: "bold" }}>Clientes asignados</Text>
                    <Text style={{ color: "black", fontSize: 25 }}>{clientesAsignados.length}</Text>
                </View>
                <Icon name='person-outline' color={colors.primary} size={35} />
            </View>
            <View style={style.cardContainer}>
                <View>
                    <Text style={{ color: "black", fontWeight: "bold" }}>Visitas del dia</Text>
                    <Text style={{ color: "black", fontSize: 25 }}>{visitas.length}</Text>
                </View>
                <Icon name='add-business' color={colors.primary} size={35} />
            </View>
            <View style={style.cardContainer}>
                <View>
                    <Text style={{ color: "black", fontWeight: "bold" }}>Tareas del dia</Text>
                    <Text style={{ color: "black", fontSize: 25 }}>{tareas.length}</Text>
                </View>
                <Icon name='fact-check' color={colors.primary} size={35} />
            </View>
            <View style={[style.sectionWrapper, { marginTop: 25 }]}>
                {tareas.length === 0 ? <View style={{ height: 105 * 2, justifyContent: "center" }}><Text>No hay tareas para hoy</Text></View> : <><Text style={{ fontWeight: "bold", color: "black", fontSize: 15 }}>Cumplimiento Tareas</Text>
                    <DonutChart
                        data={[{ name: "Pendientes", color: "orange", value: pendientes }, { name: "Completadas", color: "green", value: completadas }]}
                        strokeWidth={15}
                        radius={90}
                        containerWidth={width - 8 * 2}
                        containerHeight={105 * 2}
                        type="butt"
                        startAngle={0}
                        endAngle={360}
                        animationType="slide"
                    />
                    <View style={{ flexDirection: "row", justifyContent: "space-evenly", width: "100%" }}>
                        {[{ name: "Pendientes", color: "orange", value: pendientes }, { name: "Completadas", color: "green", value: completadas }].map(e => {
                            return <View style={{ justifyContent: "center", alignItems: "center", padding: 10 }}>
                                <Text style={{ color: e.color, fontWeight: "bold" }}>{e.name}</Text>
                            </View>
                        })}
                    </View></>}
            </View>
        </ScrollView>
    )
}

const style = StyleSheet.create({
    cardContainer: {
        backgroundColor: colors.white,
        marginTop: 20,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        borderColor: "#c1c1c1",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    sectionWrapper: {
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 8,
        borderColor: "lightgray",
        backgroundColor: "#ffffff",
        marginVertical: 8,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2,
    },
});