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
            System.Diagnostics.Debug.Write(ItemName);
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
        public void DeleteItem(int Id)
        {
            string cs = ConfigurationManager.ConnectionStrings["DBCS"].ConnectionString;
            using (SqlConnection con = new SqlConnection(cs))
            {
                SqlCommand cmd = new SqlCommand("USP_Delete_Item", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Id", Id);
                 con.Open();
                cmd.ExecuteNonQuery();
                con.Close();
            }
        }
    }
}
