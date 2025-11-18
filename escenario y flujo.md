OK MI rey, quiero reugnta tenemos la capacidad de revertir al estaod antes de la junta? podrisa ayudamre a aclarar eso? existe la forma de revertirlo una vez ya aplicado? 

entonces vamos a  analziar esto:
1. antes de darle confirmar, como esta la sociedad? get a flow y me arroja esto:
{
    "success": true,
    "message": "Lista de flujos encontradas correctamente.",
    "data": [
        {
            "id": 5,
            "uuid": "4d9f53a7-131b-4eaa-9338-d299deb3a12a",
            "societyProfileId": 1,
            "generalMeetingFlowsId": 5,
            "statusProgression": "Creado",
            "status": true,
            "createdAt": "2025-11-17T17:39:37.423Z",
            "updatedAt": "2025-11-17T17:39:37.423Z",
            "structure": {
                "id": 5,
                "uuid": "2cbdcfd3-b75a-444b-a87f-41aa52ff498f",
                "societyGeneralFlowId": 5,
                "typeMeetingId": 5,
                "meetingDetailsId": 4,
                "designationPresidentSecretaryId": 4,
                "currentStep": "vote-contributions",
                "status": true,
                "createdAt": "2025-11-17T17:39:37.424Z",
                "updatedAt": "2025-11-17T17:39:37.424Z",
                "contributorsId": 6,
                "contributionsId": 5,
                "voteAgreementId": null,
                "actionsId": 6,
                "allocationShareId": 6,
                "powersRepresentationId": null,
                "capitalizationCreditsId": 5,
                "creditorsId": 6,
                "shareholderId": 6,
                "voteCountDirectorsId": null,
                "voteDesignationId": null,
                "voteRemovalId": null,
                "assistanceShareholderId": 6,
                "financialStatementsId": null,
                "voteDividendDistributionId": null,
                "voteFinancialStatementsId": null,
                "distributionDividendsId": null,
                "voteContributionsId": 4,
                "voteCreditCapitalizationId": null,
                "designationRemovalDirectorId": 6,
                "designationRemovalManagerId": 6,
                "powerRegimeFlowId": 6,
                "voteDesignationManagerId": null,
                "voteRemovalManagerId": null,
                "typeMeeting": {
                    "id": 5,
                    "uuid": "8b80c4b4-dcd9-435c-acbd-399039c79519",
                    "status": true,
                    "createdAt": "2025-11-17T17:39:37.418Z",
                    "updatedAt": "2025-11-17T17:39:37.418Z",
                    "name": "JUNTA_UNIVERSAL"
                },
                "meetingDetails": {
                    "id": 4,
                    "uuid": "f1936058-574f-4797-81fb-621169c4cfaf",
                    "status": true,
                    "selectMeeting": "first",
                    "firstMeetingId": 6,
                    "secondMeetingId": null,
                    "createdAt": "2025-11-17T17:39:41.538Z",
                    "updatedAt": "2025-11-17T17:39:41.538Z"
                },
                "contributors": {
                    "id": 6,
                    "uuid": "6b3a05b1-534c-41f9-97df-ef7ec6ab1a56",
                    "status": true,
                    "createdAt": "2025-11-17T17:39:37.430Z",
                    "updatedAt": "2025-11-17T17:39:37.430Z",
                    "details": [
                        {
                            "id": 17,
                            "uuid": "1ba1bef0-9fed-42d4-b97d-978830616df8",
                            "shareholderId": 6,
                            "personId": 22,
                            "status": true,
                            "createdAt": "2025-11-17T17:39:59.218Z",
                            "updatedAt": "2025-11-17T17:39:59.218Z",
                            "representativeId": null,
                            "typeShareholder": "NUEVO_ACCIONISTA",
                            "isPresent": null,
                            "isContributor": true,
                            "person": {
                                "id": 22,
                                "uuid": "24318b6f-09c3-48bc-8395-916e10dff2ac",
                                "type": "NATURAL",
                                "status": true,
                                "createdAt": "2025-11-17T17:39:59.218Z",
                                "updatedAt": "2025-11-17T17:39:59.218Z",
                                "natural": {
                                    "id": 22,
                                    "uuid": "4907c399-cf65-4b61-9f73-978bfe9754a4",
                                    "documentNumber": "78021456",
                                    "firstName": "SOLEDAD KEMBERLY",
                                    "lastNamePaternal": "TIMOTEO",
                                    "lastNameMaternal": "CHOQUEPIUNTA",
                                    "status": true,
                                    "createdAt": "2025-11-17T17:39:59.218Z",
                                    "updatedAt": "2025-11-17T17:39:59.218Z",
                                    "typeDocument": "DNI",
                                    "personId": 22,
                                    "issuingCountry": null
                                },
                                "juridic": null
                            },
                            "allocationShareDetails": []
                        },
                        {
                            "id": 16,
                            "uuid": "134bdd42-23a7-4029-a140-b0b78d65089a",
                            "shareholderId": 6,
                            "personId": 20,
                            "status": true,
                            "createdAt": "2025-11-17T17:39:37.453Z",
                            "updatedAt": "2025-11-17T17:40:02.235Z",
                            "representativeId": null,
                            "typeShareholder": "ACCIONISTA",
                            "isPresent": true,
                            "isContributor": true,
                            "person": {
                                "id": 20,
                                "uuid": "d42b99f8-48c5-4c21-b4e8-a80425358cf1",
                                "type": "NATURAL",
                                "status": true,
                                "createdAt": "2025-11-17T17:39:37.453Z",
                                "updatedAt": "2025-11-17T17:40:02.235Z",
                                "natural": {
                                    "id": 20,
                                    "uuid": "115d8dc6-0c4a-4dc3-8d45-f1dc4fde4dd4",
                                    "documentNumber": "78021334",
                                    "firstName": "asdfasdf",
                                    "lastNamePaternal": "asdfasdf",
                                    "lastNameMaternal": "asdfasfd",
                                    "status": true,
                                    "createdAt": "2025-11-17T17:39:37.453Z",
                                    "updatedAt": "2025-11-17T17:40:02.235Z",
                                    "typeDocument": "PASAPORTE",
                                    "personId": 20,
                                    "issuingCountry": null
                                },
                                "juridic": null
                            },
                            "allocationShareDetails": [
                                {
                                    "id": 9,
                                    "uuid": "25aa4908-480c-4c8b-a7c9-fa5e981501c1",
                                    "actionId": 6,
                                    "shareholderId": 16,
                                    "allocationShareId": 6,
                                    "subscribedSharesQuantity": 500,
                                    "pricePerShare": 1,
                                    "percentagePaidPerShare": 25,
                                    "unpaidDividendTotal": 0,
                                    "fullyPaid": true,
                                    "createdAt": "2025-11-17T17:39:37.468Z",
                                    "updatedAt": "2025-11-17T17:39:37.468Z",
                                    "status": true,
                                    "actionDetail": {
                                        "id": 6,
                                        "actionId": 6,
                                        "type": "COMMON",
                                        "name": "",
                                        "nominalValue": 1,
                                        "subscribedAmounts": 500,
                                        "hasRedeemable": false,
                                        "hasRightVote": true,
                                        "hasOtherSpecialRights": false,
                                        "fileOtherSpecialRightId": null,
                                        "hasAdditionalObligations": false,
                                        "fileAdditionalObligationsId": null,
                                        "hasCommon": false,
                                        "status": true,
                                        "createdAt": "2025-11-17T17:39:37.453Z",
                                        "updatedAt": "2025-11-17T17:39:37.453Z",
                                        "uuid": "0f5e5b77-22e4-40b2-8d0a-e01cc55e81b4"
                                    }
                                }
                            ]
                        }
                    ]
                },
                "contributions": {
                    "id": 5,
                    "uuid": "67421c6e-29be-487f-ac73-700789b0db2a",
                    "status": true,
                    "createdAt": "2025-11-17T17:39:37.430Z",
                    "updatedAt": "2025-11-17T17:39:37.430Z",
                    "details": [
                        {
                            "id": 8,
                            "uuid": "10b4144a-15d3-443b-986e-c38cdda10554",
                            "contributionsId": 5,
                            "shareholderDetailId": 17,
                            "actionDetailId": 6,
                            "currency": "PEN",
                            "amount": 300,
                            "contributionDate": "2025-11-05T00:00:00.000Z",
                            "exchangeRate": null,
                            "exchangedAmount": null,
                            "sharesToReceive": 300,
                            "pricePerShare": 1,
                            "hasFullyPaid": true,
                            "socialCapital": 300,
                            "premium": 0,
                            "reserve": 0,
                            "status": true,
                            "createdAt": "2025-11-17T17:40:20.176Z",
                            "updatedAt": "2025-11-17T17:40:20.176Z",
                            "paidPercent": null,
                            "passiveTotal": null,
                            "fileAccountingEntryId": 7
                        },
                        {
                            "id": 9,
                            "uuid": "ff4d3b5c-8e09-49e4-83d4-1c9ac93e6d4c",
                            "contributionsId": 5,
                            "shareholderDetailId": 16,
                            "actionDetailId": 6,
                            "currency": "PEN",
                            "amount": 200,
                            "contributionDate": "2025-11-20T00:00:00.000Z",
                            "exchangeRate": null,
                            "exchangedAmount": null,
                            "sharesToReceive": 200,
                            "pricePerShare": 1,
                            "hasFullyPaid": true,
                            "socialCapital": 200,
                            "premium": 0,
                            "reserve": 0,
                            "status": true,
                            "createdAt": "2025-11-17T17:40:38.313Z",
                            "updatedAt": "2025-11-17T17:40:38.313Z",
                            "paidPercent": null,
                            "passiveTotal": null,
                            "fileAccountingEntryId": 8
                        }
                    ]
                },
                "creditors": {
                    "id": 6,
                    "uuid": "6b3a05b1-534c-41f9-97df-ef7ec6ab1a56",
                    "status": true,
                    "createdAt": "2025-11-17T17:39:37.430Z",
                    "updatedAt": "2025-11-17T17:39:37.430Z",
                    "details": [
                        {
                            "id": 17,
                            "uuid": "1ba1bef0-9fed-42d4-b97d-978830616df8",
                            "shareholderId": 6,
                            "personId": 22,
                            "status": true,
                            "createdAt": "2025-11-17T17:39:59.218Z",
                            "updatedAt": "2025-11-17T17:39:59.218Z",
                            "representativeId": null,
                            "typeShareholder": "NUEVO_ACCIONISTA",
                            "isPresent": null,
                            "isContributor": true,
                            "person": {
                                "id": 22,
                                "uuid": "24318b6f-09c3-48bc-8395-916e10dff2ac",
                                "type": "NATURAL",
                                "status": true,
                                "createdAt": "2025-11-17T17:39:59.218Z",
                                "updatedAt": "2025-11-17T17:39:59.218Z",
                                "natural": {
                                    "id": 22,
                                    "uuid": "4907c399-cf65-4b61-9f73-978bfe9754a4",
                                    "documentNumber": "78021456",
                                    "firstName": "SOLEDAD KEMBERLY",
                                    "lastNamePaternal": "TIMOTEO",
                                    "lastNameMaternal": "CHOQUEPIUNTA",
                                    "status": true,
                                    "createdAt": "2025-11-17T17:39:59.218Z",
                                    "updatedAt": "2025-11-17T17:39:59.218Z",
                                    "typeDocument": "DNI",
                                    "personId": 22,
                                    "issuingCountry": null
                                },
                                "juridic": null
                            },
                            "allocationShareDetails": []
                        },
                        {
                            "id": 16,
                            "uuid": "134bdd42-23a7-4029-a140-b0b78d65089a",
                            "shareholderId": 6,
                            "personId": 20,
                            "status": true,
                            "createdAt": "2025-11-17T17:39:37.453Z",
                            "updatedAt": "2025-11-17T17:40:02.235Z",
                            "representativeId": null,
                            "typeShareholder": "ACCIONISTA",
                            "isPresent": true,
                            "isContributor": true,
                            "person": {
                                "id": 20,
                                "uuid": "d42b99f8-48c5-4c21-b4e8-a80425358cf1",
                                "type": "NATURAL",
                                "status": true,
                                "createdAt": "2025-11-17T17:39:37.453Z",
                                "updatedAt": "2025-11-17T17:40:02.235Z",
                                "natural": {
                                    "id": 20,
                                    "uuid": "115d8dc6-0c4a-4dc3-8d45-f1dc4fde4dd4",
                                    "documentNumber": "78021334",
                                    "firstName": "asdfasdf",
                                    "lastNamePaternal": "asdfasdf",
                                    "lastNameMaternal": "asdfasfd",
                                    "status": true,
                                    "createdAt": "2025-11-17T17:39:37.453Z",
                                    "updatedAt": "2025-11-17T17:40:02.235Z",
                                    "typeDocument": "PASAPORTE",
                                    "personId": 20,
                                    "issuingCountry": null
                                },
                                "juridic": null
                            },
                            "allocationShareDetails": [
                                {
                                    "id": 9,
                                    "uuid": "25aa4908-480c-4c8b-a7c9-fa5e981501c1",
                                    "actionId": 6,
                                    "shareholderId": 16,
                                    "allocationShareId": 6,
                                    "subscribedSharesQuantity": 500,
                                    "pricePerShare": 1,
                                    "percentagePaidPerShare": 25,
                                    "unpaidDividendTotal": 0,
                                    "fullyPaid": true,
                                    "createdAt": "2025-11-17T17:39:37.468Z",
                                    "updatedAt": "2025-11-17T17:39:37.468Z",
                                    "status": true,
                                    "actionDetail": {
                                        "id": 6,
                                        "actionId": 6,
                                        "type": "COMMON",
                                        "name": "",
                                        "nominalValue": 1,
                                        "subscribedAmounts": 500,
                                        "hasRedeemable": false,
                                        "hasRightVote": true,
                                        "hasOtherSpecialRights": false,
                                        "fileOtherSpecialRightId": null,
                                        "hasAdditionalObligations": false,
                                        "fileAdditionalObligationsId": null,
                                        "hasCommon": false,
                                        "status": true,
                                        "createdAt": "2025-11-17T17:39:37.453Z",
                                        "updatedAt": "2025-11-17T17:39:37.453Z",
                                        "uuid": "0f5e5b77-22e4-40b2-8d0a-e01cc55e81b4"
                                    }
                                }
                            ]
                        }
                    ]
                },
                "capitalizationCredits": {
                    "id": 5,
                    "uuid": "0731337e-f7e8-437d-8cc6-0675ab840b7b",
                    "status": true,
                    "createdAt": "2025-11-17T17:39:37.430Z",
                    "updatedAt": "2025-11-17T17:39:37.430Z",
                    "details": []
                }
            },
            "typeFlow": "MONETARY_CONTRIBUTION",
            "typeMeeting": "JUNTA_UNIVERSAL",
            "resumenAcuerdos": {
                "aumentoCapital": {
                    "aportantes": [
                        {
                            "id": 17,
                            "contributorType": "NUEVO_ACCIONISTA",
                            "isPresent": false,
                            "isContributor": true,
                            "contributor": {
                                "personId": 22,
                                "type": "NATURAL",
                                "typeDocument": "DNI",
                                "documentNumber": "78021456",
                                "firstName": "SOLEDAD KEMBERLY",
                                "lastNamePaternal": "TIMOTEO",
                                "lastNameMaternal": "CHOQUEPIUNTA"
                            },
                            "allocationShare": []
                        },
                        {
                            "id": 16,
                            "contributorType": "ACCIONISTA",
                            "isPresent": true,
                            "isContributor": true,
                            "contributor": {
                                "personId": 20,
                                "type": "NATURAL",
                                "typeDocument": "PASAPORTE",
                                "documentNumber": "78021334",
                                "firstName": "asdfasdf",
                                "lastNamePaternal": "asdfasdf",
                                "lastNameMaternal": "asdfasfd"
                            },
                            "allocationShare": [
                                {
                                    "id": 9,
                                    "action": {
                                        "id": 6,
                                        "type": "COMMON",
                                        "name": "",
                                        "hasRightVote": true,
                                        "hasCommon": false
                                    },
                                    "subscribedSharesQuantity": "500",
                                    "pricePerShare": "1",
                                    "percentagePaidPerShare": "25",
                                    "unpaidDividendTotal": "0",
                                    "fullyPaid": true
                                }
                            ]
                        },
                        {
                            "id": 17,
                            "contributorType": "NUEVO_ACCIONISTA",
                            "isPresent": false,
                            "isContributor": true,
                            "contributor": {
                                "personId": 22,
                                "type": "NATURAL",
                                "typeDocument": "DNI",
                                "documentNumber": "78021456",
                                "firstName": "SOLEDAD KEMBERLY",
                                "lastNamePaternal": "TIMOTEO",
                                "lastNameMaternal": "CHOQUEPIUNTA"
                            },
                            "allocationShare": []
                        },
                        {
                            "id": 16,
                            "contributorType": "ACCIONISTA",
                            "isPresent": true,
                            "isContributor": true,
                            "contributor": {
                                "personId": 20,
                                "type": "NATURAL",
                                "typeDocument": "PASAPORTE",
                                "documentNumber": "78021334",
                                "firstName": "asdfasdf",
                                "lastNamePaternal": "asdfasdf",
                                "lastNameMaternal": "asdfasfd"
                            },
                            "allocationShare": [
                                {
                                    "id": 9,
                                    "action": {
                                        "id": 6,
                                        "type": "COMMON",
                                        "name": "",
                                        "hasRightVote": true,
                                        "hasCommon": false
                                    },
                                    "subscribedSharesQuantity": "500",
                                    "pricePerShare": "1",
                                    "percentagePaidPerShare": "25",
                                    "unpaidDividendTotal": "0",
                                    "fullyPaid": true
                                }
                            ]
                        }
                    ],
                    "aportes": [
                        {
                            "id": 8,
                            "shareholderId": 17,
                            "actionId": 6,
                            "currency": "PEN",
                            "amount": 300,
                            "contributionDate": "2025-11-05T00:00:00.000Z",
                            "exchangeRate": null,
                            "exchangedAmount": null,
                            "sharesToReceive": 300,
                            "pricePerShare": 1,
                            "hasFullyPaid": true,
                            "socialCapital": 300,
                            "premium": 0,
                            "reserve": 0
                        },
                        {
                            "id": 9,
                            "shareholderId": 16,
                            "actionId": 6,
                            "currency": "PEN",
                            "amount": 200,
                            "contributionDate": "2025-11-20T00:00:00.000Z",
                            "exchangeRate": null,
                            "exchangedAmount": null,
                            "sharesToReceive": 200,
                            "pricePerShare": 1,
                            "hasFullyPaid": true,
                            "socialCapital": 200,
                            "premium": 0,
                            "reserve": 0
                        }
                    ]
                }
            }
        }
    ],
    "code": 200
}

2. le doy confirmar, y me arroja consola:

client:789 [vite] connecting...
client:912 [vite] connected.
prepare.js:1 🍍 "LayoutStore" store installed 🆕
main.ts:75 [Vue Router warn]: <router-view> can no longer be used directly inside <transition> or <keep-alive>.
Use slot props instead:

<router-view v-slot="{ Component }">
  <transition>
    <component :is="Component" />
  </transition>
</router-view>
warn @ vue-router.js?v=918b1d82:50
warnDeprecatedUsage @ vue-router.js?v=918b1d82:1774
setup @ vue-router.js?v=918b1d82:1686
callWithErrorHandling @ chunk-2PPVUSDT.js?v=918b1d82:2480
setupStatefulComponent @ chunk-2PPVUSDT.js?v=918b1d82:8959
setupComponent @ chunk-2PPVUSDT.js?v=918b1d82:8920
mountComponent @ chunk-2PPVUSDT.js?v=918b1d82:6449
processComponent @ chunk-2PPVUSDT.js?v=918b1d82:6415
patch @ chunk-2PPVUSDT.js?v=918b1d82:5931
componentUpdateFn @ chunk-2PPVUSDT.js?v=918b1d82:6559
run @ chunk-2PPVUSDT.js?v=918b1d82:1772
setupRenderEffect @ chunk-2PPVUSDT.js?v=918b1d82:6687
mountComponent @ chunk-2PPVUSDT.js?v=918b1d82:6462
processComponent @ chunk-2PPVUSDT.js?v=918b1d82:6415
patch @ chunk-2PPVUSDT.js?v=918b1d82:5931
componentUpdateFn @ chunk-2PPVUSDT.js?v=918b1d82:6559
run @ chunk-2PPVUSDT.js?v=918b1d82:1772
setupRenderEffect @ chunk-2PPVUSDT.js?v=918b1d82:6687
mountComponent @ chunk-2PPVUSDT.js?v=918b1d82:6462
processComponent @ chunk-2PPVUSDT.js?v=918b1d82:6415
patch @ chunk-2PPVUSDT.js?v=918b1d82:5931
mountChildren @ chunk-2PPVUSDT.js?v=918b1d82:6163
mountElement @ chunk-2PPVUSDT.js?v=918b1d82:6086
processElement @ chunk-2PPVUSDT.js?v=918b1d82:6051
patch @ chunk-2PPVUSDT.js?v=918b1d82:5919
mountChildren @ chunk-2PPVUSDT.js?v=918b1d82:6163
mountElement @ chunk-2PPVUSDT.js?v=918b1d82:6086
processElement @ chunk-2PPVUSDT.js?v=918b1d82:6051
patch @ chunk-2PPVUSDT.js?v=918b1d82:5919
mountChildren @ chunk-2PPVUSDT.js?v=918b1d82:6163
mountElement @ chunk-2PPVUSDT.js?v=918b1d82:6086
processElement @ chunk-2PPVUSDT.js?v=918b1d82:6051
patch @ chunk-2PPVUSDT.js?v=918b1d82:5919
componentUpdateFn @ chunk-2PPVUSDT.js?v=918b1d82:6559
run @ chunk-2PPVUSDT.js?v=918b1d82:1772
setupRenderEffect @ chunk-2PPVUSDT.js?v=918b1d82:6687
mountComponent @ chunk-2PPVUSDT.js?v=918b1d82:6462
processComponent @ chunk-2PPVUSDT.js?v=918b1d82:6415
patch @ chunk-2PPVUSDT.js?v=918b1d82:5931
componentUpdateFn @ chunk-2PPVUSDT.js?v=918b1d82:6559
run @ chunk-2PPVUSDT.js?v=918b1d82:1772
setupRenderEffect @ chunk-2PPVUSDT.js?v=918b1d82:6687
mountComponent @ chunk-2PPVUSDT.js?v=918b1d82:6462
processComponent @ chunk-2PPVUSDT.js?v=918b1d82:6415
patch @ chunk-2PPVUSDT.js?v=918b1d82:5931
mountChildren @ chunk-2PPVUSDT.js?v=918b1d82:6163
mountElement @ chunk-2PPVUSDT.js?v=918b1d82:6086
processElement @ chunk-2PPVUSDT.js?v=918b1d82:6051
patch @ chunk-2PPVUSDT.js?v=918b1d82:5919
mountChildren @ chunk-2PPVUSDT.js?v=918b1d82:6163
mountElement @ chunk-2PPVUSDT.js?v=918b1d82:6086
processElement @ chunk-2PPVUSDT.js?v=918b1d82:6051
patch @ chunk-2PPVUSDT.js?v=918b1d82:5919
mountChildren @ chunk-2PPVUSDT.js?v=918b1d82:6163
mountElement @ chunk-2PPVUSDT.js?v=918b1d82:6086
processElement @ chunk-2PPVUSDT.js?v=918b1d82:6051
patch @ chunk-2PPVUSDT.js?v=918b1d82:5919
componentUpdateFn @ chunk-2PPVUSDT.js?v=918b1d82:6559
run @ chunk-2PPVUSDT.js?v=918b1d82:1772
setupRenderEffect @ chunk-2PPVUSDT.js?v=918b1d82:6687
mountComponent @ chunk-2PPVUSDT.js?v=918b1d82:6462
processComponent @ chunk-2PPVUSDT.js?v=918b1d82:6415
patch @ chunk-2PPVUSDT.js?v=918b1d82:5931
componentUpdateFn @ chunk-2PPVUSDT.js?v=918b1d82:6639
run @ chunk-2PPVUSDT.js?v=918b1d82:1772
runIfDirty @ chunk-2PPVUSDT.js?v=918b1d82:1810
callWithErrorHandling @ chunk-2PPVUSDT.js?v=918b1d82:2480
flushJobs @ chunk-2PPVUSDT.js?v=918b1d82:2679
Promise.then
queueFlush @ chunk-2PPVUSDT.js?v=918b1d82:2594
queuePostFlushCb @ chunk-2PPVUSDT.js?v=918b1d82:2608
queueEffectWithSuspense @ chunk-2PPVUSDT.js?v=918b1d82:8441
baseWatchOptions.scheduler @ chunk-2PPVUSDT.js?v=918b1d82:7416
effect2.scheduler @ chunk-2PPVUSDT.js?v=918b1d82:1548
trigger @ chunk-2PPVUSDT.js?v=918b1d82:1800
endBatch @ chunk-2PPVUSDT.js?v=918b1d82:642
notify @ chunk-2PPVUSDT.js?v=918b1d82:1915
trigger @ chunk-2PPVUSDT.js?v=918b1d82:1889
set value @ chunk-2PPVUSDT.js?v=918b1d82:2222
finalizeNavigation @ vue-router.js?v=918b1d82:2518
(anonymous) @ vue-router.js?v=918b1d82:2428
Promise.then
pushWithRedirect @ vue-router.js?v=918b1d82:2396
push @ vue-router.js?v=918b1d82:2322
install @ vue-router.js?v=918b1d82:2677
use @ chunk-2PPVUSDT.js?v=918b1d82:5199
(anonymous) @ main.ts:75
prepare.js:1 🍍 "app-store" store installed 🆕
prepare.js:1 🍍 "historial-registros" store installed 🆕
prepare.js:1 🍍 "storeTriggerDataFlow" store installed 🆕
prepare.js:1 🍍 "sociedades-store" store installed 🆕
prepare.js:1 🍍 "tablePoderes" store installed 🆕
prepare.js:1 🍍 "registerSociety" store installed 🆕
historial-registros.store.ts:49 {dataData: Array(1)}
prepare.js:1 🍍 "increaseMeettingStore" store installed 🆕
historial-registros.store.ts:49 {dataData: Array(1)}
DropdownOption.vue:67 🔄 [CONFIRMAR] Iniciando confirmación completa... {societyId: 1, flowId: 5, flowType: 'MONETARY_CONTRIBUTION'}
DropdownOption.vue:75 📝 [CONFIRMAR] Actualizando statusProgression a FINISHED...
historial-registros.store.ts:49 {dataData: Array(1)}
DropdownOption.vue:77 ✅ [CONFIRMAR] Status actualizado
DropdownOption.vue:81 💰 [CONFIRMAR] Es aporte dinerario, actualizando registro...
update-registry-from-junta.utils.ts:1171 🚀 [CONFIRMAR JUNTA] Iniciando confirmación... {societyId: 1, flowId: 5}
update-registry-from-junta.utils.ts:1178 📡 [CONFIRMAR JUNTA] Obteniendo datos de la junta...
update-registry-from-junta.utils.ts:1189 ✅ [CONFIRMAR JUNTA] Junta encontrada: {flowId: 5, typeFlow: 'MONETARY_CONTRIBUTION', statusProgression: 'Completado'}
update-registry-from-junta.utils.ts:1202 🔍 [CONFIRMAR JUNTA] Buscando contributions... {fromStructure: 2, structureContributionsExists: true, resumenAcuerdosExists: true, resumenAportesCount: 2}
update-registry-from-junta.utils.ts:1270 📊 [CONFIRMAR JUNTA] Datos de la junta: {contributorsCount: 2, contributionsCount: 2, contributors: Array(2), contributions: Array(2)}
update-registry-from-junta.utils.ts:1293 📡 [CONFIRMAR JUNTA] Obteniendo datos actuales del registro...
update-registry-from-junta.utils.ts:1299 ✅ [CONFIRMAR JUNTA] Shareholders actuales: {count: 1, shareholders: Array(1)}
update-registry-from-junta.utils.ts:1310 ✅ [CONFIRMAR JUNTA] Actions obtenidas: {hasMainAction: true, customActionsCount: 1}
update-registry-from-junta.utils.ts:1316 📡 [CONFIRMAR JUNTA] Obteniendo allocation shares actuales del registro...
update-registry-from-junta.utils.ts:1319 ✅ [CONFIRMAR JUNTA] Allocation shares actuales: {count: 1, allocations: Array(1)}
update-registry-from-junta.utils.ts:1330 🔍 [CONFIRMAR JUNTA] Obteniendo acciones del flow para match...
update-registry-from-junta.utils.ts:178 🔍 [GET FLOW ACTIONS] Obteniendo acciones del flow... {contributorsCount: 2, contributionsCount: 2}
update-registry-from-junta.utils.ts:194   ✅ [GET FLOW ACTIONS] Acción agregada desde contributor: {actionId: 6, type: 'COMMON', nominalValue: 1}
update-registry-from-junta.utils.ts:214 ✅ [GET FLOW ACTIONS] Acciones obtenidas: {count: 1, actions: Array(1)}
match-ids.utils.ts:273 🔍 [MATCH] Creando mapa de actions por type + nominalValue... {hasMainAction: true, customActionsCount: 1}
match-ids.utils.ts:284   ✅ [MATCH] Acción principal agregada: {key: 'COMMON-1', actionId: 1, nominalValue: 1}
match-ids.utils.ts:298   ✅ [MATCH] Acción personalizada agregada: {key: 'COMMON-1', actionId: 1, type: 'COMMON', nominalValue: 1}
match-ids.utils.ts:307 ✅ [MATCH] Mapa de actions creado: {totalEntries: 1}
match-ids.utils.ts:338 🔍 [MATCH] Buscando match para flowAction... {flowActionId: 6, type: 'COMMON', nominalValue: 1}
match-ids.utils.ts:351   🔑 [MATCH] Clave obtenida: {key: 'COMMON-1'}
match-ids.utils.ts:368   ✅ [MATCH] Match encontrado: {flowActionId: 6, actionId: 1, key: 'COMMON-1'}
update-registry-from-junta.utils.ts:1333 ✅ [CONFIRMAR JUNTA] Flow actions mapeadas: {flowActionsCount: 1, matchesCount: 1}
update-registry-from-junta.utils.ts:1339 🧮 [CONFIRMAR JUNTA] Calculando estado 'después'...
update-registry-from-junta.utils.ts:246 🧮 [CALCULAR ESTADO DESPUÉS] Iniciando cálculo... {contributorsCount: 2, contributionsCount: 2, shareholdersCount: 1}
update-registry-from-junta.utils.ts:253 🔍 [CALCULAR ESTADO DESPUÉS] Haciendo match de contributors...
match-ids.utils.ts:232 🔄 [MATCH] Iniciando match de contributors a shareholders... {totalContributors: 2, totalShareholders: 1}
match-ids.utils.ts:93 🔍 [MATCH] Creando mapa de shareholders por documento... {totalShareholders: 1}
match-ids.utils.ts:106   ✅ [MATCH] Shareholder agregado al mapa: {key: 'PASAPORTE-78021334', shareholderId: 1, typeDocument: 'PASAPORTE', documentNumber: '78021334'}
match-ids.utils.ts:121 ✅ [MATCH] Mapa de shareholders creado: {totalEntries: 1}
match-ids.utils.ts:182 🔍 [MATCH] Buscando match para contributor... {contributorId: 17}
match-ids.utils.ts:196   📄 [MATCH] Documento obtenido: {documentKey: 'DNI-78021456'}
match-ids.utils.ts:201 ⚠️ [MATCH] No se encontró match para contributor 17 con documento DNI-78021456 {contributorId: 17, documentKey: 'DNI-78021456', availableKeys: Array(1)}
matchContributorToShareholder @ match-ids.utils.ts:201
(anonymous) @ match-ids.utils.ts:241
matchContributorsToShareholders @ match-ids.utils.ts:240
calcularEstadoDespues @ update-registry-from-junta.utils.ts:254
confirmarJunta @ update-registry-from-junta.utils.ts:1341
await in confirmarJunta
handleConfirm @ DropdownOption.vue:85
await in handleConfirm
callWithErrorHandling @ chunk-2PPVUSDT.js?v=918b1d82:2480
callWithAsyncErrorHandling @ chunk-2PPVUSDT.js?v=918b1d82:2487
invoker @ chunk-2PPVUSDT.js?v=918b1d82:11478
match-ids.utils.ts:182 🔍 [MATCH] Buscando match para contributor... {contributorId: 16}
match-ids.utils.ts:196   📄 [MATCH] Documento obtenido: {documentKey: 'PASAPORTE-78021334'}
match-ids.utils.ts:212   ✅ [MATCH] Match encontrado: {contributorId: 16, shareholderId: 1, documentKey: 'PASAPORTE-78021334'}
match-ids.utils.ts:248 ✅ [MATCH] Match de contributors completado: {totalMatches: 1, totalContributors: 2, matches: Array(1)}
update-registry-from-junta.utils.ts:260 ✅ [CALCULAR ESTADO DESPUÉS] Validando matches...
update-registry-from-junta.utils.ts:267 ℹ️ [CALCULAR ESTADO DESPUÉS] Contributors sin match (nuevos accionistas): {missingMatches: Array(1), totalContributors: 2, totalMatches: 1, note: 'Estos contributors serán agregados como nuevos accionistas'}
update-registry-from-junta.utils.ts:307 🔍 [CALCULAR ESTADO DESPUÉS] Obteniendo acciones del flow...
update-registry-from-junta.utils.ts:178 🔍 [GET FLOW ACTIONS] Obteniendo acciones del flow... {contributorsCount: 2, contributionsCount: 2}
update-registry-from-junta.utils.ts:194   ✅ [GET FLOW ACTIONS] Acción agregada desde contributor: {actionId: 6, type: 'COMMON', nominalValue: 1}
update-registry-from-junta.utils.ts:214 ✅ [GET FLOW ACTIONS] Acciones obtenidas: {count: 1, actions: Array(1)}
update-registry-from-junta.utils.ts:309 ✅ [CALCULAR ESTADO DESPUÉS] Acciones del flow: {count: 1, actions: Array(1)}
update-registry-from-junta.utils.ts:314 🔍 [CALCULAR ESTADO DESPUÉS] Haciendo match de actions...
match-ids.utils.ts:273 🔍 [MATCH] Creando mapa de actions por type + nominalValue... {hasMainAction: true, customActionsCount: 1}
match-ids.utils.ts:284   ✅ [MATCH] Acción principal agregada: {key: 'COMMON-1', actionId: 1, nominalValue: 1}
match-ids.utils.ts:298   ✅ [MATCH] Acción personalizada agregada: {key: 'COMMON-1', actionId: 1, type: 'COMMON', nominalValue: 1}
match-ids.utils.ts:307 ✅ [MATCH] Mapa de actions creado: {totalEntries: 1}
match-ids.utils.ts:338 🔍 [MATCH] Buscando match para flowAction... {flowActionId: 6, type: 'COMMON', nominalValue: 1}
match-ids.utils.ts:351   🔑 [MATCH] Clave obtenida: {key: 'COMMON-1'}
match-ids.utils.ts:368   ✅ [MATCH] Match encontrado: {flowActionId: 6, actionId: 1, key: 'COMMON-1'}
update-registry-from-junta.utils.ts:318 ✅ [CALCULAR ESTADO DESPUÉS] Validando matches de actions...
update-registry-from-junta.utils.ts:330 ✅ [CALCULAR ESTADO DESPUÉS] Todas las actions tienen match
update-registry-from-junta.utils.ts:335 🔍 [CALCULAR ESTADO DESPUÉS] Creando mapa global de actionDetailId -> actionId...
update-registry-from-junta.utils.ts:343   ✅ [CALCULAR ESTADO DESPUÉS] Mapeo global: actionDetailId 6 → actionId 1 (flowActionId: 6)
update-registry-from-junta.utils.ts:348 ✅ [CALCULAR ESTADO DESPUÉS] Mapa global creado: {size: 1, entries: Array(1)}
update-registry-from-junta.utils.ts:354 📊 [CALCULAR ESTADO DESPUÉS] Agrupando contributions por contributorId...
update-registry-from-junta.utils.ts:410   ✅ [CALCULAR ESTADO DESPUÉS] Contribution 8 agrupada bajo flowContributorId 17 {contributionShareholderId: undefined, contributionShareholderDetailId: 17, flowContributorId: 17}
update-registry-from-junta.utils.ts:410   ✅ [CALCULAR ESTADO DESPUÉS] Contribution 9 agrupada bajo flowContributorId 16 {contributionShareholderId: undefined, contributionShareholderDetailId: 16, flowContributorId: 16}
update-registry-from-junta.utils.ts:425 ✅ [CALCULAR ESTADO DESPUÉS] Contributions agrupadas: {contributorsConContributions: 2, contributionsByContributor: Array(2)}
update-registry-from-junta.utils.ts:436 🧮 [CALCULAR ESTADO DESPUÉS] Calculando nuevos accionistas y actualizaciones...
update-registry-from-junta.utils.ts:441   📝 [CALCULAR ESTADO DESPUÉS] Procesando contributor 1/2... {contributorId: 17}
update-registry-from-junta.utils.ts:90 🔄 [MAPPER] Mapeando contributor a ShareholderDto... {contributorId: 17, hasContributor: false, hasPerson: true}
update-registry-from-junta.utils.ts:113   ✅ [MAPPER] ShareholderDto NATURAL creado: {type: 'NATURAL', typeDocument: 'DNI', documentNumber: '78021456', firstName: 'SOLEDAD KEMBERLY', lastNamePaternal: 'TIMOTEO', …}
update-registry-from-junta.utils.ts:459     🆕 [CALCULAR ESTADO DESPUÉS] Nuevo accionista (sin ID, será creado por el backend)
update-registry-from-junta.utils.ts:467     📊 [CALCULAR ESTADO DESPUÉS] Contributor tiene 1 contributions
update-registry-from-junta.utils.ts:471     📊 [CALCULAR ESTADO DESPUÉS] Procesando 0 allocationShareDetails...
update-registry-from-junta.utils.ts:601       🔍 [CALCULAR ESTADO DESPUÉS] Contribution 8: actionDetailId 6 → actionId del registro 1 (usando mapa global)
update-registry-from-junta.utils.ts:632       🆕 [CALCULAR ESTADO DESPUÉS] Creando allocation share desde contribution 8 para nuevo accionista (ID temporal: -17, actionId: 1, shares: 300)
update-registry-from-junta.utils.ts:441   📝 [CALCULAR ESTADO DESPUÉS] Procesando contributor 2/2... {contributorId: 16}
update-registry-from-junta.utils.ts:90 🔄 [MAPPER] Mapeando contributor a ShareholderDto... {contributorId: 16, hasContributor: false, hasPerson: true}
update-registry-from-junta.utils.ts:113   ✅ [MAPPER] ShareholderDto NATURAL creado: {type: 'NATURAL', typeDocument: 'PASAPORTE', documentNumber: '78021334', firstName: 'asdfasdf', lastNamePaternal: 'asdfasdf', …}
update-registry-from-junta.utils.ts:455     ✅ [CALCULAR ESTADO DESPUÉS] Accionista existente (ID: 1)
update-registry-from-junta.utils.ts:467     📊 [CALCULAR ESTADO DESPUÉS] Contributor tiene 1 contributions
update-registry-from-junta.utils.ts:471     📊 [CALCULAR ESTADO DESPUÉS] Procesando 1 allocationShareDetails...
update-registry-from-junta.utils.ts:499       📊 [CALCULAR ESTADO DESPUÉS] Cantidad inicial desde REGISTRO: 500 acciones (shareholderId: 1, actionId: 1)
update-registry-from-junta.utils.ts:529       ➕ [CALCULAR ESTADO DESPUÉS] Sumando 200 acciones de contribution 9 {contributionActionId: undefined, contributionActionDetailId: 6, allocationActionId: 6, allocationActionDetailId: 6}
update-registry-from-junta.utils.ts:545       ✅ [CALCULAR ESTADO DESPUÉS] Total final: 700 acciones
update-registry-from-junta.utils.ts:559       🔍 [CALCULAR ESTADO DESPUÉS] ID del registro encontrado: 1 (shareholderId: 1, actionId: 1)
update-registry-from-junta.utils.ts:601       🔍 [CALCULAR ESTADO DESPUÉS] Contribution 9: actionDetailId 6 → actionId del registro 1 (usando mapa global)
update-registry-from-junta.utils.ts:643       ℹ️ [CALCULAR ESTADO DESPUÉS] Allocation share ya existe para 1-1, no se duplica desde contribution 9
update-registry-from-junta.utils.ts:649 🔄 [CALCULAR ESTADO DESPUÉS] Convirtiendo maps a arrays...
update-registry-from-junta.utils.ts:677 ✅ [CALCULAR ESTADO DESPUÉS] Estado 'después' calculado: {shareholdersCount: 2, existingShareholdersCount: 1, newShareholdersCount: 1, allocationSharesCount: 2, newShareholdersMapSize: 1}
update-registry-from-junta.utils.ts:1354 ✅ [CONFIRMAR JUNTA] Estado 'después' calculado: {shareholdersCount: 2, allocationSharesCount: 2, shareholders: Array(2), allocationShares: Array(2)}
update-registry-from-junta.utils.ts:1362 📤 [CONFIRMAR JUNTA] Enviando updates al backend...
update-registry-from-junta.utils.ts:1368 💰 [CONFIRMAR JUNTA] Calculando capital social desde contributions + allocation shares actuales...
update-registry-from-junta.utils.ts:711 💰 [ACTUALIZAR CAPITAL SOCIAL] Calculando desde contributions + allocation shares actuales... {contributionsCount: 2, currentActionsCount: 1}
update-registry-from-junta.utils.ts:722 💰 [ACTUALIZAR CAPITAL SOCIAL] Obteniendo allocation shares actuales...
update-registry-from-junta.utils.ts:725 💰 [ACTUALIZAR CAPITAL SOCIAL] Allocation shares actuales: {count: 1, totalActual: 500}
update-registry-from-junta.utils.ts:740   📊 [ACTUALIZAR CAPITAL SOCIAL] Allocation actual: actionId=1, cantidad=500, total=500
update-registry-from-junta.utils.ts:761   ➕ [ACTUALIZAR CAPITAL SOCIAL] Contribution: actionId=1, sharesToAdd=300, total=800
update-registry-from-junta.utils.ts:761   ➕ [ACTUALIZAR CAPITAL SOCIAL] Contribution: actionId=1, sharesToAdd=200, total=1000
update-registry-from-junta.utils.ts:764 💰 [ACTUALIZAR CAPITAL SOCIAL] Totales calculados: {totals: Array(1)}
update-registry-from-junta.utils.ts:776   💰 [ACTUALIZAR CAPITAL SOCIAL] Acción 1 (COMMON): 500 → 1000
update-registry-from-junta.utils.ts:812 📋 [BODY 1] CAPITAL SOCIAL (PUT /actions): {endpoint: 'PUT /api/v1/society-profile/1/actions', body: '{\n  "action": {\n    "nominalValue": 1\n  },\n  "cust…ons": false,\n      "hasCommon": false\n    }\n  ]\n}', actionNominalValue: 1, customActionsCount: 1, customActions: Array(1)}
update-registry-from-junta.utils.ts:830 ✅ [ACTUALIZAR CAPITAL SOCIAL] Acciones actualizadas en el backend
update-registry-from-junta.utils.ts:1375 ✅ [CONFIRMAR JUNTA] Capital social actualizado
update-registry-from-junta.utils.ts:1380 📋 [BODY 2] ACCIONISTAS (PUT /shareholders): {endpoint: 'PUT /api/v1/society-profile/1/shareholders', body: '{\n  "shareholders": [\n    {\n      "type": "NATURAL…   "lastNameMaternal": "CHOQUEPIUNTA"\n    }\n  ]\n}', shareholdersCount: 2, shareholders: Array(2)}
update-registry-from-junta.utils.ts:1399 ✅ [CONFIRMAR JUNTA] Shareholders actualizados: {response: {…}}
update-registry-from-junta.utils.ts:1408 🔍 [CONFIRMAR JUNTA] Verificando nuevos accionistas... {newShareholdersCount: 1, newShareholdersMapSize: 1, newShareholdersMap: Array(1), responseShareholdersCount: 2}
update-registry-from-junta.utils.ts:1416 🔄 [CONFIRMAR JUNTA] Mapeando IDs temporales a IDs reales...
update-registry-from-junta.utils.ts:1423   📝 [CONFIRMAR JUNTA] Shareholder en respuesta: DNI-78021456 → ID 18
update-registry-from-junta.utils.ts:1423   📝 [CONFIRMAR JUNTA] Shareholder en respuesta: PASAPORTE-78021334 → ID 1
update-registry-from-junta.utils.ts:1432   🔍 [CONFIRMAR JUNTA] Buscando match para nuevo accionista: DNI-78021456
update-registry-from-junta.utils.ts:1441   ✅ [CONFIRMAR JUNTA] Mapeado: ID temporal -17 → ID real 18 (DNI-78021456, contributorId: 17)
update-registry-from-junta.utils.ts:1452 ✅ [CONFIRMAR JUNTA] Mapeo completado: {tempIdToRealIdMapSize: 1, tempIdToRealIdMap: Array(1)}
update-registry-from-junta.utils.ts:1466 🔄 [CONFIRMAR JUNTA] Actualizando allocationShares con IDs reales... {tempIdToRealIdMapSize: 1, tempIdToRealIdMap: Array(1), allocationSharesBeforeUpdate: Array(2)}
update-registry-from-junta.utils.ts:1482   ✅ [CONFIRMAR JUNTA] Actualizando allocation: ID temporal -17 → ID real 18 (actionId: 1, shares: 300)
update-registry-from-junta.utils.ts:1491 ✅ [CONFIRMAR JUNTA] 1 allocation shares actualizados con IDs reales
update-registry-from-junta.utils.ts:1505 📋 [BODY 2] ALLOCATION SHARES (PUT /allocation-shares): {endpoint: 'PUT /api/v1/society-profile/1/allocation-shares', body: '{\n  "allocationShare": [\n    {\n      "actionId": 1…endTotal": 0,\n      "fullyPaid": true\n    }\n  ]\n}', allocationSharesCount: 2, allocationShares: Array(2)}
update-registry-from-junta.utils.ts:1521 ✅ [CONFIRMAR JUNTA] Allocation shares actualizados
update-registry-from-junta.utils.ts:1523 ✅ [CONFIRMAR JUNTA] Junta confirmada exitosamente
DropdownOption.vue:86 ✅ [CONFIRMAR] Registro actualizado exitosamente


3. acutalizo para ver el get despues de darle confirmar:
{
    "success": true,
    "message": "Lista de flujos encontradas correctamente.",
    "data": [
        {
            "id": 5,
            "uuid": "4d9f53a7-131b-4eaa-9338-d299deb3a12a",
            "societyProfileId": 1,
            "generalMeetingFlowsId": 5,
            "statusProgression": "Completado",
            "status": true,
            "createdAt": "2025-11-17T17:39:37.423Z",
            "updatedAt": "2025-11-17T17:42:43.281Z",
            "structure": {
                "id": 5,
                "uuid": "2cbdcfd3-b75a-444b-a87f-41aa52ff498f",
                "societyGeneralFlowId": 5,
                "typeMeetingId": 5,
                "meetingDetailsId": 4,
                "designationPresidentSecretaryId": 4,
                "currentStep": "vote-contributions",
                "status": true,
                "createdAt": "2025-11-17T17:39:37.424Z",
                "updatedAt": "2025-11-17T17:39:37.424Z",
                "contributorsId": 6,
                "contributionsId": 5,
                "voteAgreementId": null,
                "actionsId": 6,
                "allocationShareId": 6,
                "powersRepresentationId": null,
                "capitalizationCreditsId": 5,
                "creditorsId": 6,
                "shareholderId": 6,
                "voteCountDirectorsId": null,
                "voteDesignationId": null,
                "voteRemovalId": null,
                "assistanceShareholderId": 6,
                "financialStatementsId": null,
                "voteDividendDistributionId": null,
                "voteFinancialStatementsId": null,
                "distributionDividendsId": null,
                "voteContributionsId": 4,
                "voteCreditCapitalizationId": null,
                "designationRemovalDirectorId": 6,
                "designationRemovalManagerId": 6,
                "powerRegimeFlowId": 6,
                "voteDesignationManagerId": null,
                "voteRemovalManagerId": null,
                "typeMeeting": {
                    "id": 5,
                    "uuid": "8b80c4b4-dcd9-435c-acbd-399039c79519",
                    "status": true,
                    "createdAt": "2025-11-17T17:39:37.418Z",
                    "updatedAt": "2025-11-17T17:39:37.418Z",
                    "name": "JUNTA_UNIVERSAL"
                },
                "meetingDetails": {
                    "id": 4,
                    "uuid": "f1936058-574f-4797-81fb-621169c4cfaf",
                    "status": true,
                    "selectMeeting": "first",
                    "firstMeetingId": 6,
                    "secondMeetingId": null,
                    "createdAt": "2025-11-17T17:39:41.538Z",
                    "updatedAt": "2025-11-17T17:39:41.538Z"
                },
                "contributors": {
                    "id": 6,
                    "uuid": "6b3a05b1-534c-41f9-97df-ef7ec6ab1a56",
                    "status": true,
                    "createdAt": "2025-11-17T17:39:37.430Z",
                    "updatedAt": "2025-11-17T17:39:37.430Z",
                    "details": [
                        {
                            "id": 17,
                            "uuid": "1ba1bef0-9fed-42d4-b97d-978830616df8",
                            "shareholderId": 6,
                            "personId": 22,
                            "status": true,
                            "createdAt": "2025-11-17T17:39:59.218Z",
                            "updatedAt": "2025-11-17T17:39:59.218Z",
                            "representativeId": null,
                            "typeShareholder": "NUEVO_ACCIONISTA",
                            "isPresent": null,
                            "isContributor": true,
                            "person": {
                                "id": 22,
                                "uuid": "24318b6f-09c3-48bc-8395-916e10dff2ac",
                                "type": "NATURAL",
                                "status": true,
                                "createdAt": "2025-11-17T17:39:59.218Z",
                                "updatedAt": "2025-11-17T17:39:59.218Z",
                                "natural": {
                                    "id": 22,
                                    "uuid": "4907c399-cf65-4b61-9f73-978bfe9754a4",
                                    "documentNumber": "78021456",
                                    "firstName": "SOLEDAD KEMBERLY",
                                    "lastNamePaternal": "TIMOTEO",
                                    "lastNameMaternal": "CHOQUEPIUNTA",
                                    "status": true,
                                    "createdAt": "2025-11-17T17:39:59.218Z",
                                    "updatedAt": "2025-11-17T17:39:59.218Z",
                                    "typeDocument": "DNI",
                                    "personId": 22,
                                    "issuingCountry": null
                                },
                                "juridic": null
                            },
                            "allocationShareDetails": []
                        },
                        {
                            "id": 16,
                            "uuid": "134bdd42-23a7-4029-a140-b0b78d65089a",
                            "shareholderId": 6,
                            "personId": 20,
                            "status": true,
                            "createdAt": "2025-11-17T17:39:37.453Z",
                            "updatedAt": "2025-11-17T17:40:02.235Z",
                            "representativeId": null,
                            "typeShareholder": "ACCIONISTA",
                            "isPresent": true,
                            "isContributor": true,
                            "person": {
                                "id": 20,
                                "uuid": "d42b99f8-48c5-4c21-b4e8-a80425358cf1",
                                "type": "NATURAL",
                                "status": true,
                                "createdAt": "2025-11-17T17:39:37.453Z",
                                "updatedAt": "2025-11-17T17:40:02.235Z",
                                "natural": {
                                    "id": 20,
                                    "uuid": "115d8dc6-0c4a-4dc3-8d45-f1dc4fde4dd4",
                                    "documentNumber": "78021334",
                                    "firstName": "asdfasdf",
                                    "lastNamePaternal": "asdfasdf",
                                    "lastNameMaternal": "asdfasfd",
                                    "status": true,
                                    "createdAt": "2025-11-17T17:39:37.453Z",
                                    "updatedAt": "2025-11-17T17:40:02.235Z",
                                    "typeDocument": "PASAPORTE",
                                    "personId": 20,
                                    "issuingCountry": null
                                },
                                "juridic": null
                            },
                            "allocationShareDetails": [
                                {
                                    "id": 9,
                                    "uuid": "25aa4908-480c-4c8b-a7c9-fa5e981501c1",
                                    "actionId": 6,
                                    "shareholderId": 16,
                                    "allocationShareId": 6,
                                    "subscribedSharesQuantity": 500,
                                    "pricePerShare": 1,
                                    "percentagePaidPerShare": 25,
                                    "unpaidDividendTotal": 0,
                                    "fullyPaid": true,
                                    "createdAt": "2025-11-17T17:39:37.468Z",
                                    "updatedAt": "2025-11-17T17:39:37.468Z",
                                    "status": true,
                                    "actionDetail": {
                                        "id": 6,
                                        "actionId": 6,
                                        "type": "COMMON",
                                        "name": "",
                                        "nominalValue": 1,
                                        "subscribedAmounts": 500,
                                        "hasRedeemable": false,
                                        "hasRightVote": true,
                                        "hasOtherSpecialRights": false,
                                        "fileOtherSpecialRightId": null,
                                        "hasAdditionalObligations": false,
                                        "fileAdditionalObligationsId": null,
                                        "hasCommon": false,
                                        "status": true,
                                        "createdAt": "2025-11-17T17:39:37.453Z",
                                        "updatedAt": "2025-11-17T17:39:37.453Z",
                                        "uuid": "0f5e5b77-22e4-40b2-8d0a-e01cc55e81b4"
                                    }
                                }
                            ]
                        }
                    ]
                },
                "contributions": {
                    "id": 5,
                    "uuid": "67421c6e-29be-487f-ac73-700789b0db2a",
                    "status": true,
                    "createdAt": "2025-11-17T17:39:37.430Z",
                    "updatedAt": "2025-11-17T17:39:37.430Z",
                    "details": [
                        {
                            "id": 8,
                            "uuid": "10b4144a-15d3-443b-986e-c38cdda10554",
                            "contributionsId": 5,
                            "shareholderDetailId": 17,
                            "actionDetailId": 6,
                            "currency": "PEN",
                            "amount": 300,
                            "contributionDate": "2025-11-05T00:00:00.000Z",
                            "exchangeRate": null,
                            "exchangedAmount": null,
                            "sharesToReceive": 300,
                            "pricePerShare": 1,
                            "hasFullyPaid": true,
                            "socialCapital": 300,
                            "premium": 0,
                            "reserve": 0,
                            "status": true,
                            "createdAt": "2025-11-17T17:40:20.176Z",
                            "updatedAt": "2025-11-17T17:40:20.176Z",
                            "paidPercent": null,
                            "passiveTotal": null,
                            "fileAccountingEntryId": 7
                        },
                        {
                            "id": 9,
                            "uuid": "ff4d3b5c-8e09-49e4-83d4-1c9ac93e6d4c",
                            "contributionsId": 5,
                            "shareholderDetailId": 16,
                            "actionDetailId": 6,
                            "currency": "PEN",
                            "amount": 200,
                            "contributionDate": "2025-11-20T00:00:00.000Z",
                            "exchangeRate": null,
                            "exchangedAmount": null,
                            "sharesToReceive": 200,
                            "pricePerShare": 1,
                            "hasFullyPaid": true,
                            "socialCapital": 200,
                            "premium": 0,
                            "reserve": 0,
                            "status": true,
                            "createdAt": "2025-11-17T17:40:38.313Z",
                            "updatedAt": "2025-11-17T17:40:38.313Z",
                            "paidPercent": null,
                            "passiveTotal": null,
                            "fileAccountingEntryId": 8
                        }
                    ]
                },
                "creditors": {
                    "id": 6,
                    "uuid": "6b3a05b1-534c-41f9-97df-ef7ec6ab1a56",
                    "status": true,
                    "createdAt": "2025-11-17T17:39:37.430Z",
                    "updatedAt": "2025-11-17T17:39:37.430Z",
                    "details": [
                        {
                            "id": 17,
                            "uuid": "1ba1bef0-9fed-42d4-b97d-978830616df8",
                            "shareholderId": 6,
                            "personId": 22,
                            "status": true,
                            "createdAt": "2025-11-17T17:39:59.218Z",
                            "updatedAt": "2025-11-17T17:39:59.218Z",
                            "representativeId": null,
                            "typeShareholder": "NUEVO_ACCIONISTA",
                            "isPresent": null,
                            "isContributor": true,
                            "person": {
                                "id": 22,
                                "uuid": "24318b6f-09c3-48bc-8395-916e10dff2ac",
                                "type": "NATURAL",
                                "status": true,
                                "createdAt": "2025-11-17T17:39:59.218Z",
                                "updatedAt": "2025-11-17T17:39:59.218Z",
                                "natural": {
                                    "id": 22,
                                    "uuid": "4907c399-cf65-4b61-9f73-978bfe9754a4",
                                    "documentNumber": "78021456",
                                    "firstName": "SOLEDAD KEMBERLY",
                                    "lastNamePaternal": "TIMOTEO",
                                    "lastNameMaternal": "CHOQUEPIUNTA",
                                    "status": true,
                                    "createdAt": "2025-11-17T17:39:59.218Z",
                                    "updatedAt": "2025-11-17T17:39:59.218Z",
                                    "typeDocument": "DNI",
                                    "personId": 22,
                                    "issuingCountry": null
                                },
                                "juridic": null
                            },
                            "allocationShareDetails": []
                        },
                        {
                            "id": 16,
                            "uuid": "134bdd42-23a7-4029-a140-b0b78d65089a",
                            "shareholderId": 6,
                            "personId": 20,
                            "status": true,
                            "createdAt": "2025-11-17T17:39:37.453Z",
                            "updatedAt": "2025-11-17T17:40:02.235Z",
                            "representativeId": null,
                            "typeShareholder": "ACCIONISTA",
                            "isPresent": true,
                            "isContributor": true,
                            "person": {
                                "id": 20,
                                "uuid": "d42b99f8-48c5-4c21-b4e8-a80425358cf1",
                                "type": "NATURAL",
                                "status": true,
                                "createdAt": "2025-11-17T17:39:37.453Z",
                                "updatedAt": "2025-11-17T17:40:02.235Z",
                                "natural": {
                                    "id": 20,
                                    "uuid": "115d8dc6-0c4a-4dc3-8d45-f1dc4fde4dd4",
                                    "documentNumber": "78021334",
                                    "firstName": "asdfasdf",
                                    "lastNamePaternal": "asdfasdf",
                                    "lastNameMaternal": "asdfasfd",
                                    "status": true,
                                    "createdAt": "2025-11-17T17:39:37.453Z",
                                    "updatedAt": "2025-11-17T17:40:02.235Z",
                                    "typeDocument": "PASAPORTE",
                                    "personId": 20,
                                    "issuingCountry": null
                                },
                                "juridic": null
                            },
                            "allocationShareDetails": [
                                {
                                    "id": 9,
                                    "uuid": "25aa4908-480c-4c8b-a7c9-fa5e981501c1",
                                    "actionId": 6,
                                    "shareholderId": 16,
                                    "allocationShareId": 6,
                                    "subscribedSharesQuantity": 500,
                                    "pricePerShare": 1,
                                    "percentagePaidPerShare": 25,
                                    "unpaidDividendTotal": 0,
                                    "fullyPaid": true,
                                    "createdAt": "2025-11-17T17:39:37.468Z",
                                    "updatedAt": "2025-11-17T17:39:37.468Z",
                                    "status": true,
                                    "actionDetail": {
                                        "id": 6,
                                        "actionId": 6,
                                        "type": "COMMON",
                                        "name": "",
                                        "nominalValue": 1,
                                        "subscribedAmounts": 500,
                                        "hasRedeemable": false,
                                        "hasRightVote": true,
                                        "hasOtherSpecialRights": false,
                                        "fileOtherSpecialRightId": null,
                                        "hasAdditionalObligations": false,
                                        "fileAdditionalObligationsId": null,
                                        "hasCommon": false,
                                        "status": true,
                                        "createdAt": "2025-11-17T17:39:37.453Z",
                                        "updatedAt": "2025-11-17T17:39:37.453Z",
                                        "uuid": "0f5e5b77-22e4-40b2-8d0a-e01cc55e81b4"
                                    }
                                }
                            ]
                        }
                    ]
                },
                "capitalizationCredits": {
                    "id": 5,
                    "uuid": "0731337e-f7e8-437d-8cc6-0675ab840b7b",
                    "status": true,
                    "createdAt": "2025-11-17T17:39:37.430Z",
                    "updatedAt": "2025-11-17T17:39:37.430Z",
                    "details": []
                }
            },
            "typeFlow": "MONETARY_CONTRIBUTION",
            "typeMeeting": "JUNTA_UNIVERSAL",
            "resumenAcuerdos": {
                "aumentoCapital": {
                    "aportantes": [
                        {
                            "id": 17,
                            "contributorType": "NUEVO_ACCIONISTA",
                            "isPresent": false,
                            "isContributor": true,
                            "contributor": {
                                "personId": 22,
                                "type": "NATURAL",
                                "typeDocument": "DNI",
                                "documentNumber": "78021456",
                                "firstName": "SOLEDAD KEMBERLY",
                                "lastNamePaternal": "TIMOTEO",
                                "lastNameMaternal": "CHOQUEPIUNTA"
                            },
                            "allocationShare": []
                        },
                        {
                            "id": 16,
                            "contributorType": "ACCIONISTA",
                            "isPresent": true,
                            "isContributor": true,
                            "contributor": {
                                "personId": 20,
                                "type": "NATURAL",
                                "typeDocument": "PASAPORTE",
                                "documentNumber": "78021334",
                                "firstName": "asdfasdf",
                                "lastNamePaternal": "asdfasdf",
                                "lastNameMaternal": "asdfasfd"
                            },
                            "allocationShare": [
                                {
                                    "id": 9,
                                    "action": {
                                        "id": 6,
                                        "type": "COMMON",
                                        "name": "",
                                        "hasRightVote": true,
                                        "hasCommon": false
                                    },
                                    "subscribedSharesQuantity": "500",
                                    "pricePerShare": "1",
                                    "percentagePaidPerShare": "25",
                                    "unpaidDividendTotal": "0",
                                    "fullyPaid": true
                                }
                            ]
                        },
                        {
                            "id": 17,
                            "contributorType": "NUEVO_ACCIONISTA",
                            "isPresent": false,
                            "isContributor": true,
                            "contributor": {
                                "personId": 22,
                                "type": "NATURAL",
                                "typeDocument": "DNI",
                                "documentNumber": "78021456",
                                "firstName": "SOLEDAD KEMBERLY",
                                "lastNamePaternal": "TIMOTEO",
                                "lastNameMaternal": "CHOQUEPIUNTA"
                            },
                            "allocationShare": []
                        },
                        {
                            "id": 16,
                            "contributorType": "ACCIONISTA",
                            "isPresent": true,
                            "isContributor": true,
                            "contributor": {
                                "personId": 20,
                                "type": "NATURAL",
                                "typeDocument": "PASAPORTE",
                                "documentNumber": "78021334",
                                "firstName": "asdfasdf",
                                "lastNamePaternal": "asdfasdf",
                                "lastNameMaternal": "asdfasfd"
                            },
                            "allocationShare": [
                                {
                                    "id": 9,
                                    "action": {
                                        "id": 6,
                                        "type": "COMMON",
                                        "name": "",
                                        "hasRightVote": true,
                                        "hasCommon": false
                                    },
                                    "subscribedSharesQuantity": "500",
                                    "pricePerShare": "1",
                                    "percentagePaidPerShare": "25",
                                    "unpaidDividendTotal": "0",
                                    "fullyPaid": true
                                }
                            ]
                        }
                    ],
                    "aportes": [
                        {
                            "id": 8,
                            "shareholderId": 17,
                            "actionId": 6,
                            "currency": "PEN",
                            "amount": 300,
                            "contributionDate": "2025-11-05T00:00:00.000Z",
                            "exchangeRate": null,
                            "exchangedAmount": null,
                            "sharesToReceive": 300,
                            "pricePerShare": 1,
                            "hasFullyPaid": true,
                            "socialCapital": 300,
                            "premium": 0,
                            "reserve": 0
                        },
                        {
                            "id": 9,
                            "shareholderId": 16,
                            "actionId": 6,
                            "currency": "PEN",
                            "amount": 200,
                            "contributionDate": "2025-11-20T00:00:00.000Z",
                            "exchangeRate": null,
                            "exchangedAmount": null,
                            "sharesToReceive": 200,
                            "pricePerShare": 1,
                            "hasFullyPaid": true,
                            "socialCapital": 200,
                            "premium": 0,
                            "reserve": 0
                        }
                    ]
                }
            }
        }
    ],
    "code": 200
}

4. ahora le doy revertir y me sale esto en consola:

 [vite] connecting...
 [vite] connected.
 🍍 "LayoutStore" store installed 🆕
 [Vue Router warn]: <router-view> can no longer be used directly inside <transition> or <keep-alive>.
Use slot props instead:

<router-view v-slot="{ Component }">
  <transition>
    <component :is="Component" />
  </transition>
</router-view>
warn @ vue-router.js?v=918b1d82:50
warnDeprecatedUsage @ vue-router.js?v=918b1d82:1774
setup @ vue-router.js?v=918b1d82:1686
callWithErrorHandling @ chunk-2PPVUSDT.js?v=918b1d82:2480
setupStatefulComponent @ chunk-2PPVUSDT.js?v=918b1d82:8959
setupComponent @ chunk-2PPVUSDT.js?v=918b1d82:8920
mountComponent @ chunk-2PPVUSDT.js?v=918b1d82:6449
processComponent @ chunk-2PPVUSDT.js?v=918b1d82:6415
patch @ chunk-2PPVUSDT.js?v=918b1d82:5931
componentUpdateFn @ chunk-2PPVUSDT.js?v=918b1d82:6559
run @ chunk-2PPVUSDT.js?v=918b1d82:1772
setupRenderEffect @ chunk-2PPVUSDT.js?v=918b1d82:6687
mountComponent @ chunk-2PPVUSDT.js?v=918b1d82:6462
processComponent @ chunk-2PPVUSDT.js?v=918b1d82:6415
patch @ chunk-2PPVUSDT.js?v=918b1d82:5931
componentUpdateFn @ chunk-2PPVUSDT.js?v=918b1d82:6559
run @ chunk-2PPVUSDT.js?v=918b1d82:1772
setupRenderEffect @ chunk-2PPVUSDT.js?v=918b1d82:6687
mountComponent @ chunk-2PPVUSDT.js?v=918b1d82:6462
processComponent @ chunk-2PPVUSDT.js?v=918b1d82:6415
patch @ chunk-2PPVUSDT.js?v=918b1d82:5931
mountChildren @ chunk-2PPVUSDT.js?v=918b1d82:6163
mountElement @ chunk-2PPVUSDT.js?v=918b1d82:6086
processElement @ chunk-2PPVUSDT.js?v=918b1d82:6051
patch @ chunk-2PPVUSDT.js?v=918b1d82:5919
mountChildren @ chunk-2PPVUSDT.js?v=918b1d82:6163
mountElement @ chunk-2PPVUSDT.js?v=918b1d82:6086
processElement @ chunk-2PPVUSDT.js?v=918b1d82:6051
patch @ chunk-2PPVUSDT.js?v=918b1d82:5919
mountChildren @ chunk-2PPVUSDT.js?v=918b1d82:6163
mountElement @ chunk-2PPVUSDT.js?v=918b1d82:6086
processElement @ chunk-2PPVUSDT.js?v=918b1d82:6051
patch @ chunk-2PPVUSDT.js?v=918b1d82:5919
componentUpdateFn @ chunk-2PPVUSDT.js?v=918b1d82:6559
run @ chunk-2PPVUSDT.js?v=918b1d82:1772
setupRenderEffect @ chunk-2PPVUSDT.js?v=918b1d82:6687
mountComponent @ chunk-2PPVUSDT.js?v=918b1d82:6462
processComponent @ chunk-2PPVUSDT.js?v=918b1d82:6415
patch @ chunk-2PPVUSDT.js?v=918b1d82:5931
componentUpdateFn @ chunk-2PPVUSDT.js?v=918b1d82:6559
run @ chunk-2PPVUSDT.js?v=918b1d82:1772
setupRenderEffect @ chunk-2PPVUSDT.js?v=918b1d82:6687
mountComponent @ chunk-2PPVUSDT.js?v=918b1d82:6462
processComponent @ chunk-2PPVUSDT.js?v=918b1d82:6415
patch @ chunk-2PPVUSDT.js?v=918b1d82:5931
mountChildren @ chunk-2PPVUSDT.js?v=918b1d82:6163
mountElement @ chunk-2PPVUSDT.js?v=918b1d82:6086
processElement @ chunk-2PPVUSDT.js?v=918b1d82:6051
patch @ chunk-2PPVUSDT.js?v=918b1d82:5919
mountChildren @ chunk-2PPVUSDT.js?v=918b1d82:6163
mountElement @ chunk-2PPVUSDT.js?v=918b1d82:6086
processElement @ chunk-2PPVUSDT.js?v=918b1d82:6051
patch @ chunk-2PPVUSDT.js?v=918b1d82:5919
mountChildren @ chunk-2PPVUSDT.js?v=918b1d82:6163
mountElement @ chunk-2PPVUSDT.js?v=918b1d82:6086
processElement @ chunk-2PPVUSDT.js?v=918b1d82:6051
patch @ chunk-2PPVUSDT.js?v=918b1d82:5919
componentUpdateFn @ chunk-2PPVUSDT.js?v=918b1d82:6559
run @ chunk-2PPVUSDT.js?v=918b1d82:1772
setupRenderEffect @ chunk-2PPVUSDT.js?v=918b1d82:6687
mountComponent @ chunk-2PPVUSDT.js?v=918b1d82:6462
processComponent @ chunk-2PPVUSDT.js?v=918b1d82:6415
patch @ chunk-2PPVUSDT.js?v=918b1d82:5931
componentUpdateFn @ chunk-2PPVUSDT.js?v=918b1d82:6639
run @ chunk-2PPVUSDT.js?v=918b1d82:1772
runIfDirty @ chunk-2PPVUSDT.js?v=918b1d82:1810
callWithErrorHandling @ chunk-2PPVUSDT.js?v=918b1d82:2480
flushJobs @ chunk-2PPVUSDT.js?v=918b1d82:2679
Promise.then
queueFlush @ chunk-2PPVUSDT.js?v=918b1d82:2594
queuePostFlushCb @ chunk-2PPVUSDT.js?v=918b1d82:2608
queueEffectWithSuspense @ chunk-2PPVUSDT.js?v=918b1d82:8441
baseWatchOptions.scheduler @ chunk-2PPVUSDT.js?v=918b1d82:7416
effect2.scheduler @ chunk-2PPVUSDT.js?v=918b1d82:1548
trigger @ chunk-2PPVUSDT.js?v=918b1d82:1800
endBatch @ chunk-2PPVUSDT.js?v=918b1d82:642
notify @ chunk-2PPVUSDT.js?v=918b1d82:1915
trigger @ chunk-2PPVUSDT.js?v=918b1d82:1889
set value @ chunk-2PPVUSDT.js?v=918b1d82:2222
finalizeNavigation @ vue-router.js?v=918b1d82:2518
(anonymous) @ vue-router.js?v=918b1d82:2428
Promise.then
pushWithRedirect @ vue-router.js?v=918b1d82:2396
push @ vue-router.js?v=918b1d82:2322
install @ vue-router.js?v=918b1d82:2677
use @ chunk-2PPVUSDT.js?v=918b1d82:5199
(anonymous) @ main.ts?t=1763399559962:49
 🍍 "app-store" store installed 🆕
 🍍 "historial-registros" store installed 🆕
 🍍 "storeTriggerDataFlow" store installed 🆕
 🍍 "sociedades-store" store installed 🆕
 🍍 "tablePoderes" store installed 🆕
 🍍 "registerSociety" store installed 🆕
 {dataData: Array(1)}
 🍍 "increaseMeettingStore" store installed 🆕
 {dataData: Array(1)}
 🔄 [REVERTIR] Iniciando reversión completa... {societyId: 1, flowId: 5, flowType: 'MONETARY_CONTRIBUTION'}
 📝 [REVERTIR] Actualizando statusProgression a CREATED...
 {dataData: Array(1)}
 ✅ [REVERTIR] Status actualizado
 💰 [REVERTIR] Es aporte dinerario, restaurando registro...
 🔄 [REVERTIR JUNTA] Iniciando reversión... {societyId: 1, flowId: 5}
 📡 [REVERTIR JUNTA] Obteniendo datos de la junta...
 ✅ [REVERTIR JUNTA] Junta encontrada: {flowId: 5, typeFlow: 'MONETARY_CONTRIBUTION', statusProgression: 'Creado'}
 📊 [REVERTIR JUNTA] Datos de la junta: {contributorsCount: 2, contributors: Array(2)}
 📡 [REVERTIR JUNTA] Obteniendo datos actuales del registro...
 ✅ [REVERTIR JUNTA] Shareholders actuales: {count: 2, shareholders: Array(2)}
 ✅ [REVERTIR JUNTA] Actions obtenidas: {hasMainAction: true, customActionsCount: 1}
 📡 [REVERTIR JUNTA] Obteniendo allocation shares actuales del registro...
 ✅ [REVERTIR JUNTA] Allocation shares actuales: {count: 2, allocations: Array(2)}
 🔄 [REVERTIR JUNTA] Restaurando estado 'antes'...
 🔄 [RESTAURAR ESTADO ANTES] Iniciando restauración... {contributorsCount: 2, shareholdersCount: 2}
 🔍 [RESTAURAR ESTADO ANTES] Haciendo match de contributors...
 🔄 [MATCH] Iniciando match de contributors a shareholders... {totalContributors: 2, totalShareholders: 2}
 🔍 [MATCH] Creando mapa de shareholders por documento... {totalShareholders: 2}
   ✅ [MATCH] Shareholder agregado al mapa: {key: 'DNI-78021456', shareholderId: 18, typeDocument: 'DNI', documentNumber: '78021456'}
   ✅ [MATCH] Shareholder agregado al mapa: {key: 'PASAPORTE-78021334', shareholderId: 1, typeDocument: 'PASAPORTE', documentNumber: '78021334'}
 ✅ [MATCH] Mapa de shareholders creado: {totalEntries: 2}
 🔍 [MATCH] Buscando match para contributor... {contributorId: 17}
   📄 [MATCH] Documento obtenido: {documentKey: 'DNI-78021456'}
   ✅ [MATCH] Match encontrado: {contributorId: 17, shareholderId: 18, documentKey: 'DNI-78021456'}
 🔍 [MATCH] Buscando match para contributor... {contributorId: 16}
   📄 [MATCH] Documento obtenido: {documentKey: 'PASAPORTE-78021334'}
   ✅ [MATCH] Match encontrado: {contributorId: 16, shareholderId: 1, documentKey: 'PASAPORTE-78021334'}
 ✅ [MATCH] Match de contributors completado: {totalMatches: 2, totalContributors: 2, matches: Array(2)}
 ✅ [RESTAURAR ESTADO ANTES] Validando matches...
 ✅ [RESTAURAR ESTADO ANTES] Todos los contributors tienen match
 🔍 [RESTAURAR ESTADO ANTES] Obteniendo acciones del flow...
 🔍 [GET FLOW ACTIONS] Obteniendo acciones del flow... {contributorsCount: 2, contributionsCount: 0}
   ✅ [GET FLOW ACTIONS] Acción agregada desde contributor: {actionId: 6, type: 'COMMON', nominalValue: 1}
 ✅ [GET FLOW ACTIONS] Acciones obtenidas: {count: 1, actions: Array(1)}
 ✅ [RESTAURAR ESTADO ANTES] Acciones del flow: {count: 1, actions: Array(1)}
 🔍 [RESTAURAR ESTADO ANTES] Haciendo match de actions...
 🔍 [MATCH] Creando mapa de actions por type + nominalValue... {hasMainAction: true, customActionsCount: 1}
   ✅ [MATCH] Acción principal agregada: {key: 'COMMON-1', actionId: 1, nominalValue: 1}
   ✅ [MATCH] Acción personalizada agregada: {key: 'COMMON-1', actionId: 1, type: 'COMMON', nominalValue: 1}
 ✅ [MATCH] Mapa de actions creado: {totalEntries: 1}
 🔍 [MATCH] Buscando match para flowAction... {flowActionId: 6, type: 'COMMON', nominalValue: 1}
   🔑 [MATCH] Clave obtenida: {key: 'COMMON-1'}
   ✅ [MATCH] Match encontrado: {flowActionId: 6, actionId: 1, key: 'COMMON-1'}
 ✅ [RESTAURAR ESTADO ANTES] Validando matches de actions...
 ✅ [RESTAURAR ESTADO ANTES] Todas las actions tienen match
 🗑️ [RESTAURAR ESTADO ANTES] Identificando accionistas a eliminar...
 🔍 [RESTAURAR ESTADO ANTES] IDs de shareholders en contributors (estado 'antes'): {contributorShareholderIds: Array(2), contributorsCount: 2, shareholdersActualesCount: 2, shareholdersActualesIds: Array(2)}
 🗑️ [RESTAURAR ESTADO ANTES] Accionistas a eliminar: {count: 0, ids: Array(0), contributorShareholderIds: Array(2), shareholdersActualesIds: Array(2)}
 🔄 [RESTAURAR ESTADO ANTES] Mapeando contributors a ShareholderDto...
   📝 [RESTAURAR ESTADO ANTES] Procesando contributor 1/2... {contributorId: 17}
     ✅ [RESTAURAR ESTADO ANTES] ShareholderId encontrado: 18
 🔄 [MAPPER] Mapeando contributor a ShareholderDto... {contributorId: 17, hasContributor: false, hasPerson: true}
   ✅ [MAPPER] ShareholderDto NATURAL creado: {type: 'NATURAL', typeDocument: 'DNI', documentNumber: '78021456', firstName: 'SOLEDAD KEMBERLY', lastNamePaternal: 'TIMOTEO', …}
     ✅ [RESTAURAR ESTADO ANTES] ShareholderDto creado para shareholderId 18
     📊 [RESTAURAR ESTADO ANTES] Procesando 0 allocationShareDetails...
update-registry-from-junta.utils.ts:1090     ✅ [RESTAURAR ESTADO ANTES] 0 allocations mapeadas
update-registry-from-junta.utils.ts:1058   📝 [RESTAURAR ESTADO ANTES] Procesando contributor 2/2... {contributorId: 16}
update-registry-from-junta.utils.ts:1069     ✅ [RESTAURAR ESTADO ANTES] ShareholderId encontrado: 1
update-registry-from-junta.utils.ts:90 🔄 [MAPPER] Mapeando contributor a ShareholderDto... {contributorId: 16, hasContributor: false, hasPerson: true}
update-registry-from-junta.utils.ts:113   ✅ [MAPPER] ShareholderDto NATURAL creado: {type: 'NATURAL', typeDocument: 'PASAPORTE', documentNumber: '78021334', firstName: 'asdfasdf', lastNamePaternal: 'asdfasdf', …}
update-registry-from-junta.utils.ts:1075     ✅ [RESTAURAR ESTADO ANTES] ShareholderDto creado para shareholderId 1
update-registry-from-junta.utils.ts:1082     📊 [RESTAURAR ESTADO ANTES] Procesando 1 allocationShareDetails...
update-registry-from-junta.utils.ts:1090     ✅ [RESTAURAR ESTADO ANTES] 1 allocations mapeadas
update-registry-from-junta.utils.ts:1103       🔍 [RESTAURAR ESTADO ANTES] ID del registro encontrado: 1 (shareholderId: 1, actionId: 1, cantidad actual: 700 → cantidad restaurada: 500)
update-registry-from-junta.utils.ts:1123       ✅ [RESTAURAR ESTADO ANTES] Allocation agregada: 1-1 {id: 1, subscribedSharesQuantity: 500}
update-registry-from-junta.utils.ts:1134 🔄 [RESTAURAR ESTADO ANTES] Convirtiendo maps a arrays...
update-registry-from-junta.utils.ts:1143 ✅ [RESTAURAR ESTADO ANTES] Estado 'antes' restaurado: {shareholdersCount: 2, allocationSharesCount: 1, shareholdersToDeleteCount: 0, shareholdersToDelete: Array(0)}
update-registry-from-junta.utils.ts:1634 ✅ [REVERTIR JUNTA] Estado 'antes' restaurado: {shareholdersCount: 2, allocationSharesCount: 1, shareholdersToDeleteCount: 0, shareholders: Array(2), allocationShares: Array(1), …}
update-registry-from-junta.utils.ts:1644 📤 [REVERTIR JUNTA] Enviando updates al backend...
update-registry-from-junta.utils.ts:1650 📋 [REVERTIR JUNTA] ORDEN 1: Actualizando allocation shares...
update-registry-from-junta.utils.ts:1651 📋 [BODY 1] ALLOCATION SHARES (PUT /allocation-shares): {endpoint: 'PUT /api/v1/society-profile/1/allocation-shares', body: '{\n  "allocationShare": [\n    {\n      "id": 1,\n    …endTotal": 0,\n      "fullyPaid": true\n    }\n  ]\n}', allocationSharesCount: 1, allocationShares: Array(1)}
update-registry-from-junta.utils.ts:1667 ✅ [REVERTIR JUNTA] Allocation shares actualizados
update-registry-from-junta.utils.ts:1673 📋 [REVERTIR JUNTA] ORDEN 2: Actualizando accionistas...
update-registry-from-junta.utils.ts:1683 ℹ️ [REVERTIR JUNTA] No hay accionistas nuevos para eliminar
update-registry-from-junta.utils.ts:1687 📋 [BODY 2] ACCIONISTAS (PUT /shareholders): {endpoint: 'PUT /api/v1/society-profile/1/shareholders', body: '{\n  "shareholders": [\n    {\n      "type": "NATURAL…eMaternal": "asdfasfd",\n      "id": 1\n    }\n  ]\n}', shareholdersCount: 2, shareholders: Array(2)}
update-registry-from-junta.utils.ts:1705 ✅ [REVERTIR JUNTA] Shareholders actualizados
update-registry-from-junta.utils.ts:1711 💰 [REVERTIR JUNTA] ORDEN 3: Actualizando capital social...
update-registry-from-junta.utils.ts:842 💰 [ACTUALIZAR CAPITAL SOCIAL] Obteniendo allocation shares actualizados...
update-registry-from-junta.utils.ts:848 💰 [ACTUALIZAR CAPITAL SOCIAL] Calculando nuevo capital social... {allocationSharesCount: 2, currentActionsCount: 1}
update-registry-from-junta.utils.ts:869 💰 [ACTUALIZAR CAPITAL SOCIAL] Totales calculados: {totals: Array(1)}
update-registry-from-junta.utils.ts:880   💰 [ACTUALIZAR CAPITAL SOCIAL] Acción 1 (COMMON): 1000 → 800
update-registry-from-junta.utils.ts:916 📋 [BODY 3] CAPITAL SOCIAL (PUT /actions): {endpoint: 'PUT /api/v1/society-profile/1/actions', body: '{\n  "action": {\n    "nominalValue": 1\n  },\n  "cust…ons": false,\n      "hasCommon": false\n    }\n  ]\n}', actionNominalValue: 1, customActionsCount: 1, customActions: Array(1)}
update-registry-from-junta.utils.ts:934 ✅ [ACTUALIZAR CAPITAL SOCIAL] Acciones actualizadas en el backend
update-registry-from-junta.utils.ts:1713 ✅ [REVERTIR JUNTA] Capital social actualizado
update-registry-from-junta.utils.ts:1715 ✅ [REVERTIR JUNTA] Junta revertida exitosamente
DropdownOption.vue:135 ✅ [REVERTIR] Registro restaurado exitosamente
