using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AngularSnackTruck
{
    public class Item
    {
        public int Id { get; set; }
        public string ItemName { get; set; }
        public string ImageSource { get; set; }
        public int Cost { get; set; }
    }
}