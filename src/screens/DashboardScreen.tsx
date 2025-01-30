import { Text, View, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import Icon from "react-native-vector-icons/MaterialIcons";
import { colors } from '../constants';
import { useVisita, useCliente, useUsuario, useTarea } from '../store';
import { CircularProgress } from 'react-native-circular-progress';

export const DashboardScreen = () => {
    const { width } = useWindowDimensions();
    const usuario = useUsuario(e => e.usuario);
    const clientes = useCliente(e => e.clientes);
    const visitas = useVisita(e => e.visitas);
    const tareas = useTarea(e => e.tareas);
    const completadas = tareas.filter(x => x.completada).length;
    const pendientes = tareas.filter(x => !x.completada).length;

    const clientesAsignados = [...new Set(clientes.map(item => item.id))];

    const total = pendientes + completadas;
    const pendientePercentage = total ? (pendientes / total) * 100 : 0;
    const completadaPercentage = total ? (completadas / total) * 100 : 0;

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
                    <CircularProgress
                        size={180} // tamaño del gráfico
                        width={15} // grosor del círculo
                        fill={pendientePercentage} // porcentaje completado
                        tintColor="orange" // color del segmento de "Pendientes"
                        backgroundColor="transparent" // color de fondo
                        arcSweepAngle={360} // ángulo de barrido completo
                        rotation={0} // ángulo de rotación
                        lineCap="round" // tipo de borde
                        style={{ marginBottom: 10 }}
                    />
                    <CircularProgress
                        size={180} // tamaño del gráfico
                        width={15} // grosor del círculo
                        fill={completadaPercentage} // porcentaje completado
                        tintColor="green" // color del segmento de "Completadas"
                        backgroundColor="transparent" // color de fondo
                        arcSweepAngle={360} // ángulo de barrido completo
                        rotation={0} // ángulo de rotación
                        lineCap="round" // tipo de borde
                        style={{ position: 'absolute' }}
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