using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Configuration;
using System.Data.SqlClient;
using System.Web.Script.Serialization;
namespace AngularSnackTruck
{
    /// <summary>
    /// Summary description for SnackService
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
     [System.Web.Script.Services.ScriptService]   // want to call from javascript
    public class SnackService : System.Web.Services.WebService
    {

        [WebMethod]
        public void GetAllItems()
        {
            List<Item> itemsList = new List<Item>();
            string cs = ConfigurationManager.ConnectionStrings["DBCS"].ConnectionString;
            using (SqlConnection con = new SqlConnection(cs))
            {
                SqlCommand cmd = new SqlCommand("USP_Select_Items1", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                //SqlCommand cmd = new SqlCommand("select * from Items1",con);
                con.Open();
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        Item item = new Item();
                        item.Id = int.Parse(reader["Id"].ToString()); ;
                        item.ItemName = reader["ItemName"].ToString();
                        item.ImageSource = reader["ImageSource"].ToString();
                        item.Cost = int.Parse(reader["Cost"].ToString());
                        itemsList.Add(item);
                    }
                }
                con.Close();
            }
            JavaScriptSerializer js = new JavaScriptSerializer();
            Context.Response.Write(js.Serialize(itemsList));
        }

        [WebMethod]
        public void InsertItem(string ItemName, string ImageSource, int Cost)
        {
            string cs = ConfigurationManager.ConnectionStrings["DBCS"].ConnectionString;
            using (SqlConnection con = new SqlConnection(cs))
            {
                SqlCommand cmd = new SqlCommand("USP_Insert_Item", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@ItemName", ItemName);
                cmd.Parameters.AddWithValue("@ImageSource", ImageSource);
                cmd.Parameters.AddWithValue("@Cost", Cost);

                con.Open();
                cmd.ExecuteNonQuery();
                con.Close();
            }
        }

        [WebMethod]
        public void DeleteItem(string ItemName)
        {
            string cs = ConfigurationManager.ConnectionStrings["DBCS"].ConnectionString;
            using (SqlConnection con = new SqlConnection(cs))
            {
                SqlCommand cmd = new SqlCommand("USP_Delete_Item", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Itemname", ItemName);
                 con.Open();
                cmd.ExecuteNonQuery();
                con.Close();
            }
        }

        [WebMethod]
        public void UpdateItem(int Id,string ItemName, string ImageSource, int Cost)
        {
            string cs = ConfigurationManager.ConnectionStrings["DBCS"].ConnectionString;
            using (SqlConnection con = new SqlConnection(cs))
            {
                SqlCommand cmd = new SqlCommand("USP_Update_Item", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Id", Id);
                cmd.Parameters.AddWithValue("@ItemName", ItemName);
                cmd.Parameters.AddWithValue("@ImageSource", ImageSource);
                cmd.Parameters.AddWithValue("@Cost", Cost);

                con.Open();
                cmd.ExecuteNonQuery();
                con.Close();
            }
        }

        //Collections methods

        //insert into collections
        [WebMethod]
        public void InsertItemToCollection(int Id,string ItemName, int Count,int Cost)
        {
            System.Diagnostics.Debug.Write(ItemName);
            string cs = ConfigurationManager.ConnectionStrings["DBCS"].ConnectionString;
            using (SqlConnection con = new SqlConnection(cs))
            {
                SqlCommand cmd = new SqlCommand("USP_Insert_Item_To_Collection", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Id", Id);
                cmd.Parameters.AddWithValue("@ItemName", ItemName);
                cmd.Parameters.AddWithValue("@Count", Count);
                cmd.Parameters.AddWithValue("@Cost", Cost);

                cmd.Parameters.AddWithValue("@Date", DateTime.Now);


                con.Open();
                cmd.ExecuteNonQuery();
                con.Close();
            }
        }

        //get items from Collections

        [WebMethod]
        public void GetAllItemsFromCollection()
        {
            List<Collections> collectionsList = new List<Collections>();
            string cs = ConfigurationManager.ConnectionStrings["DBCS"].ConnectionString;
            using (SqlConnection con = new SqlConnection(cs))
            {
                SqlCommand cmd = new SqlCommand("USP_Select_Collections", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                //SqlCommand cmd = new SqlCommand("select * from Items1",con);
                con.Open();
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        Collections col = new Collections();
                        col.CollectionId = int.Parse(reader["CollectionId"].ToString()); ;
                        col.ItemName = reader["ItemName"].ToString();
                        col.Id = int.Parse(reader["Id"].ToString());
                        col.Cost = int.Parse(reader["Cost"].ToString());

                        col.Count = int.Parse(reader["Count"].ToString());
                        collectionsList.Add(col);
                    }
                }
                con.Close();
            }
            JavaScriptSerializer js = new JavaScriptSerializer();
            Context.Response.Write(js.Serialize(collectionsList));
        }

        //DELETE ITEM FROM COLLECTIONS
        [WebMethod]
        public void DeleteItemFromCollection(int CollectionId)
        {
            string cs = ConfigurationManager.ConnectionStrings["DBCS"].ConnectionString;
            using (SqlConnection con = new SqlConnection(cs))
            {
                SqlCommand cmd = new SqlCommand("USP_Delete_Item_From_CollectionsTemp", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@CollectionId", CollectionId);
                con.Open();
                cmd.ExecuteNonQuery();
                con.Close();
            }
        }

        //Delete temp collection
        [WebMethod]
        public void DeleteTemp()
        {
            string cs = ConfigurationManager.ConnectionStrings["DBCS"].ConnectionString;
            using (SqlConnection con = new SqlConnection(cs))
            {
                SqlCommand cmd = new SqlCommand("delete from CollectionsTemp", con);
                con.Open();
                cmd.ExecuteNonQuery();
                con.Close();
            }
        }
        
        // Get Todays Collection
        [WebMethod]
        public void GetTodaysCollection()
        {
            List<Collections> todaysCollectionList = new List<Collections>();
            string cs = ConfigurationManager.ConnectionStrings["DBCS"].ConnectionString;
            using (SqlConnection con = new SqlConnection(cs))
            {
                SqlCommand cmd = new SqlCommand("USP_Select_TodaysCollection", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Date", DateTime.Now);
                //SqlCommand cmd = new SqlCommand("select * from Items1",con);
                con.Open();
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        Collections col = new Collections();
                        col.CollectionId = 0;
                        col.ItemName = reader["ItemName"].ToString();
                        col.Id = 0;
                        col.Cost = int.Parse(reader["Cost"].ToString());

                        col.Count = int.Parse(reader["Quantity"].ToString());
                        todaysCollectionList.Add(col);
                    }
                }
                con.Close();
            }
            JavaScriptSerializer js = new JavaScriptSerializer();
            Context.Response.Write(js.Serialize(todaysCollectionList));
        }

    }
}
