import React, { useState, useCallback } from 'react'
import {
    View,
    FlatList
} from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { COLLECTION_APPOINTMENTS } from '../../configs/database'

import { Profile } from '../../components/Profile'
import { ButtonAdd } from '../../components/ButtonAdd'
import { CategorySelect } from '../../components/CategorySelect'
import { ListHeader } from '../../components/ListHeader'
import { ListDivider } from '../../components/ListDivider'
import { Background } from '../../components/Background'
import { Load } from '../../components/Load'

import { styles } from './styles'
import { Appointment, AppointmentProps } from '../../components/Appointment'
import { useNavigation, useFocusEffect } from '@react-navigation/native'

export function Home() {
    const [category, setCategory] = useState('')
    const [appointments, setAppointments] = useState<AppointmentProps[]>([])
    const [loading, setLoading] = useState(true)

    const navigation = useNavigation()

    function handleCategorySelect(categoryId: string) {
        categoryId === category ? setCategory('') : setCategory(categoryId)
    }

    function handleAppointmentDetails(guildSelected: AppointmentProps) {
        navigation.navigate('AppointmentDetails',{ guildSelected })
    }

    function handleAppointmentCreate() {
        navigation.navigate('AppointmentCreate')
    }

    async function loadAppointments() {
        const response = await AsyncStorage.getItem(COLLECTION_APPOINTMENTS)
        const storage: AppointmentProps[] = response ? JSON.parse(response) : []

        if (category) {
            setAppointments(storage.filter(item => item.category === category))
        } else {
            setAppointments(storage)
        }
        
        setLoading(false)
    }

    useFocusEffect(useCallback(() => {
        loadAppointments()
    },[category]))

    return (
       <Background>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Profile></Profile>
                    <ButtonAdd onPress={handleAppointmentCreate} />
                </View>

                <CategorySelect  
                    categorySelected={category}
                    setCategory={handleCategorySelect}
                />

                {
                    loading 
                    ? <Load /> 
                    :
                    <>
                        <ListHeader
                            title="Partidas Agendadas" 
                            subtitle={`Total ${appointments.length}`}
                        />

                        <FlatList 
                            data={appointments}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <Appointment 
                                    data={item} 
                                    onPress={() => handleAppointmentDetails(item)}
                                />
                            )}
                            contentContainerStyle={{ paddingBottom: 69 }}
                            ItemSeparatorComponent={() => <ListDivider />}
                            style={styles.matches}
                            showsVerticalScrollIndicator={false}
                        />
                    </>
                }
            </View>
       </Background>
    )
}
