using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace GeneradorMapa
{
    public partial class Paleta : Form
    {
        private Cuadricula tab_;
        public Paleta()
        {
            InitializeComponent();
            tab_ = new Cuadricula(20, 40, 0, null);
            for (int i = 0; i < tab_.get_rows(); i++)
            {
                for (int j = 0; j < tab_.get_columns(); j++)
                {
                    this.panel2.Controls.Add(this.tab_.get_Celda(i, j));
                    this.tab_.get_Celda(i, j).Click += new System.EventHandler(this.tab_.get_Celda(i, j).Celda_Click);
                }
            }
        }
    }
}
