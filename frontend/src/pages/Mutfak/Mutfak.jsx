import Layout from "../../components/Layout.jsx";
import KdsStationBoard from "../../components/KdsStationBoard.jsx";
import { KDS_STATIONS, KDS_STATUS } from "../../data/mockKdsOrders.js";

function Mutfak() {

    return (
        <Layout navbarType="dashboard" title="Mutfak">

            <KdsStationBoard
                station={KDS_STATIONS.KITCHEN}
                finalStatus={KDS_STATUS.DELIVERED}
                showDelayed
                showNotes
                pageTitle="Mutfak"
                pageSubtitle="Bugünün hazırlık operasyonu"
                emptyStateText="Şu anda hazırlanacak mutfak siparişi bulunmuyor."
            />

        </Layout>
    );

}

export default Mutfak;
