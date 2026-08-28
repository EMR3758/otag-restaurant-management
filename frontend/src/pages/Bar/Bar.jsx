import Layout from "../../components/Layout.jsx";
import KdsStationBoard from "../../components/KdsStationBoard.jsx";
import { KDS_STATIONS, KDS_STATUS } from "../../data/mockKdsOrders.js";

function Bar() {

    return (
        <Layout navbarType="dashboard" title="Bar">

            <KdsStationBoard
                station={KDS_STATIONS.BAR}
                finalStatus={KDS_STATUS.DELIVERED}
                showDelayed
                showNotes
                pageTitle="Bar"
                pageSubtitle="Bugünün hazırlık operasyonu"
                emptyStateText="Şu anda hazırlanacak bar siparişi bulunmuyor."
            />

        </Layout>
    );

}

export default Bar;
